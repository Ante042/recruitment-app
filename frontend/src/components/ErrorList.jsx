/**
 * Display a list of error messages.
 * @param {Object} props
 * @param {Array<string>} props.errors - Array of error messages
 * @returns {JSX.Element|null} Error list or null if no errors
 */
const ErrorList = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        backgroundColor: '#fee',
        border: '1px solid red',
        borderRadius: '4px',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
        {errors.map((error, index) => (
          <li key={index} style={{ color: 'red' }}>
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorList;
