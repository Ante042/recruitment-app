/**
 * Reusable button component with loading state.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.loading=false] - Loading state
 * @param {string} [props.type='button'] - Button type attribute
 * @param {Object} [props.style={}] - Custom inline styles
 * @returns {JSX.Element}
 */
const Button = ({ children, onClick, disabled = false, loading = false, type = 'button', style = {} }) => {
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
        ...style,
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
