import { useEffect, useState } from 'react';
import { dashboardAPI } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsRes = await dashboardAPI.getStats();
        setStats(statsRes.data);

        const assignedRes = await dashboardAPI.getAssignedToMe();
        setAssignedTasks(assignedRes.data);

        const overdueRes = await dashboardAPI.getOverdue();
        setOverdueTasks(overdueRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Total Tasks</div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalTasks}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Completed</div>
            <div className="text-3xl font-bold text-green-600">{stats.completedTasks}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm">In Progress</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.inProgressTasks}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Overdue</div>
            <div className="text-3xl font-bold text-red-600">{stats.overdueTasks}</div>
          </div>
        </div>
      )}

      {/* Assigned To Me */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Tasks Assigned to Me</h2>
        {assignedTasks.length > 0 ? (
          <div className="space-y-3">
            {assignedTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded border">
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-600">{task.project.name}</div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No tasks assigned to you</p>
        )}
      </div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-red-600">Overdue Tasks</h2>
          <div className="space-y-3">
            {overdueTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-red-50 rounded border border-red-200">
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-600">{task.project.name}</div>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm">
                  Overdue
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
