const ErrorList = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div
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
