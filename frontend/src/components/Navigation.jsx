import { Link, useNavigate } from 'react-router-dom';

export default function Navigation({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            TaskManager
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/projects" className="text-gray-700 hover:text-blue-600">
              Projects
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
