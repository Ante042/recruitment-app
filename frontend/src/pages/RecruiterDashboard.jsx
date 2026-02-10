import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { getApplications } from '../api/applications';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getApplications()
      .then(data => setApplications(data))
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

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
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Application List</h3>
        {loading && <p style={{ color: '#666' }}>Loading applications...</p>}
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        {!loading && !error && applications.length === 0 && (
          <p style={{ color: '#666' }}>No applications submitted yet.</p>
        )}
        {!loading && !error && applications.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0' }}>Full Name</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr
                  key={app.applicationId}
                  onClick={() => navigate(`/recruiter/applications/${app.applicationId}`)}
                  style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                >
                  <td style={{ padding: '0.75rem 1rem 0.75rem 0' }}>
                    {app.Person.firstName} {app.Person.lastName}
                  </td>
                  <td style={{ padding: '0.75rem 0' }}>
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
