import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await projectsAPI.getAll();
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.create({ name, description });
      setName('');
      setDescription('');
      setShowForm(false);
      loadProjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await projectsAPI.delete(id);
        loadProjects();
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form onSubmit={handleCreateProject}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Project
            </button>
          </form>
        </div>
      )}

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{project.tasks.length} tasks</span>
                  <span className="text-gray-600">{project.members.length} members</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No projects yet. Create one to get started!</p>
      )}
    </div>
  );
}
