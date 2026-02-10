import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', width: '100%', padding: '2rem', alignSelf: 'flex-start' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Recruiter Dashboard</h1>
        <Button onClick={handleLogout} style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Logout
        </Button>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' }}>
        <h2>Welcome, {user?.firstName} {user?.lastName}!</h2>
        <p>Username: {user?.username}</p>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '4px' }}>
        <h3>Application List</h3>
        <p style={{ color: '#666' }}>
          The application list will be available here soon. You'll be able to view and manage applicant submissions.
        </p>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
