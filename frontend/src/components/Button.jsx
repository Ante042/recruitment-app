const Button = ({ children, onClick, disabled = false, loading = false, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        backgroundColor: disabled || loading ? '#ccc' : '#007bff',
        color: 'white',
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        width: '100%',
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
