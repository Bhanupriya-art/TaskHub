import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dashboardAPI, projectsAPI, tasksAPI } from '../api';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    assignedTo: ''
  });

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    try {
      const projectRes = await projectsAPI.getById(parseInt(id));
      setProject(projectRes.data);

      const tasksRes = await tasksAPI.getByProject(parseInt(id));
      setTasks(tasksRes.data);

      const summaryRes = await dashboardAPI.getSummary(parseInt(id));
      setSummary(summaryRes.data);
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await tasksAPI.create({
        projectId: parseInt(id),
        ...taskForm,
        assignedTo: taskForm.assignedTo ? parseInt(taskForm.assignedTo) : null
      });
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedTo: '' });
      setShowTaskForm(false);
      loadProjectData();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      await tasksAPI.update(taskId, { status });
      loadProjectData();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await tasksAPI.delete(taskId);
        loadProjectData();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Delete this project?')) {
      try {
        await projectsAPI.delete(parseInt(id));
        navigate('/projects');
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!project) return <div className="p-8">Project not found</div>;

  const isAdmin = project.admin.id === localStorage.getItem('userId') || 
    project.members.some(m => m.role === 'ADMIN');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleDeleteProject}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Project
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Total</div>
            <div className="text-2xl font-bold">{summary.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Completed</div>
            <div className="text-2xl font-bold text-green-600">{summary.completed}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">In Progress</div>
            <div className="text-2xl font-bold text-yellow-600">{summary.inProgress}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Pending</div>
            <div className="text-2xl font-bold text-blue-600">{summary.pending}</div>
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Team Members</h2>
        <div className="space-y-2 mb-4">
          {project.members.map((member) => (
            <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>
                <div className="font-medium">{member.user.name}</div>
                <div className="text-sm text-gray-600">{member.user.email}</div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tasks</h2>
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showTaskForm ? 'Cancel' : 'New Task'}
          </button>
        </div>

        {showTaskForm && (
          <form onSubmit={handleCreateTask} className="mb-6 p-4 bg-gray-50 rounded">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Task title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                placeholder="Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows="2"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded"
              />
              <select
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({...taskForm, assignedTo: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Assign to...</option>
                {project.members.map((member) => (
                  <option key={member.id} value={member.user.id}>{member.user.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Task
            </button>
          </form>
        )}

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded border">
              <div className="flex-1">
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-600">{task.description}</div>
                {task.assignee && <div className="text-sm">Assigned to: {task.assignee.name}</div>}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
