const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'unhandled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle()}`}>
      {getStatusText()}
    </span>
  );
};

export default StatusBadge;
