import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validation';
import FormInput from '../components/FormInput';
import ErrorList from '../components/ErrorList';
import Button from '../components/Button';

const Login = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    const redirectPath = user.role === 'applicant' ? '/applicant' : '/recruiter';
    return <Navigate to={redirectPath} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    const result = await login(formData);

    if (result.success) {
      const redirectPath = result.data.user.role === 'applicant' ? '/applicant' : '/recruiter';
      navigate(redirectPath);
    } else {
      setLoading(false);

      if (result.error?.error) {
        setErrors(['Invalid username or password']);
      } else {
        setErrors(['Login failed. Please try again.']);
      }
    }
  };

  return (
    <div style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h1>

      <form onSubmit={handleSubmit}>
        <ErrorList errors={errors} />

        <FormInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" loading={loading} disabled={loading}>
          Login
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#007bff' }}>
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
