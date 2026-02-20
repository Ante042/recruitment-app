import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Home page that redirects authenticated users or shows login/register links.
 * @returns {JSX.Element}
 */
const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading...</p>
        <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          The server is hosted on Render's free plan and may take up to 50 seconds to wake up.
        </p>
      </div>
    );
  }

  if (user) {
    const redirectPath = user.role === 'applicant' ? '/applicant' : '/recruiter';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div style={{ maxWidth: '600px', width: '100%', padding: '2rem', textAlign: 'center' }}>
      <h1>Recruitment Application</h1>
      <p style={{ marginBottom: '2rem' }}>
        Welcome to the recruitment application system. Please login or register to continue.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link
          to="/login"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          Login
        </Link>
        <Link
          to="/register"
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
