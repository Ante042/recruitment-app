import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateRegistrationForm } from '../utils/validation';
import FormInput from '../components/FormInput';
import ErrorList from '../components/ErrorList';
import Button from '../components/Button';

const Register = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    personNumber: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegistrationForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    const result = await register(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setLoading(false);

      if (result.error?.errors) {
        setErrors(result.error.errors);
      } else if (result.error?.error) {
        setErrors([result.error.error]);
      } else {
        setErrors(['Registration failed. Please try again.']);
      }
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
        <div
          style={{
            backgroundColor: '#d4edda',
            border: '1px solid #28a745',
            borderRadius: '4px',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#155724', margin: '0 0 0.5rem 0' }}>Registration Successful!</h2>
          <p style={{ color: '#155724', margin: 0 }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Register</h1>

      <form onSubmit={handleSubmit}>
        <ErrorList errors={errors} />

        <FormInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={fieldErrors.firstName}
          required
        />

        <FormInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={fieldErrors.lastName}
          required
        />

        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          required
        />

        <FormInput
          label="Personal Number"
          name="personNumber"
          value={formData.personNumber}
          onChange={handleChange}
          error={fieldErrors.personNumber}
          placeholder="YYYYMMDD-XXXX"
          required
        />

        <FormInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={fieldErrors.username}
          required
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          required
        />

        <Button type="submit" loading={loading} disabled={loading}>
          Register
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#007bff' }}>
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
