import { useState } from 'react';

/**
 * Reusable form input component with label and error display.
 * @param {Object} props
 * @param {string} props.label - Input label text
 * @param {string} [props.type='text'] - Input type (text, password, email, etc.)
 * @param {string} props.name - Input name attribute
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {string} [props.placeholder] - Input placeholder text
 * @returns {JSX.Element}
 */
const FormInput = ({ label, type = 'text', name, value, onChange, error, required = false, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    paddingRight: isPassword ? '2.5rem' : '0.5rem',
    border: error ? '1px solid red' : '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  };

  const toggleButtonStyle = {
    position: 'absolute',
    right: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    padding: '0.25rem',
    cursor: 'pointer',
    color: '#666',
    fontSize: '1rem',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
  };

  const eyeIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const eyeOffIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={name} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      {isPassword ? (
        <div style={{ position: 'relative' }}>
          <input
            id={name}
            type={showPassword ? 'text' : 'password'}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-describedby={error ? `${name}-error` : undefined}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={toggleButtonStyle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? eyeOffIcon : eyeIcon}
          </button>
        </div>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-describedby={error ? `${name}-error` : undefined}
          style={inputStyle}
        />
      )}
      {error && (
        <p id={`${name}-error`} style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
