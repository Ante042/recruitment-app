const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'unhandled':
        return { backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' };
      case 'accepted':
        return { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' };
      case 'rejected':
        return { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db' };
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'unhandled':
        return 'Under Review';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', ...getStatusStyle() }}>
      {getStatusText()}
    </span>
  );
};

export default StatusBadge;
