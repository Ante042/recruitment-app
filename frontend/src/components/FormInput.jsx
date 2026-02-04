const FormInput = ({ label, type = 'text', name, value, onChange, error, required = false, placeholder }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={name} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-describedby={error ? `${name}-error` : undefined}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '1rem',
        }}
      />
      {error && (
        <p id={`${name}-error`} style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
