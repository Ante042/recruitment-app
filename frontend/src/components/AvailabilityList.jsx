const AvailabilityList = ({ availabilityPeriods, isEditable, onRemove }) => {
  if (availabilityPeriods.length === 0) {
    return <p style={{ color: '#666', fontStyle: 'italic' }}>No availability periods added yet</p>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {availabilityPeriods.map((period) => (
        <div
          key={period.availabilityId}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          <div>
            <span style={{ fontWeight: '500' }}>
              {formatDate(period.fromDate)} - {formatDate(period.toDate)}
            </span>
          </div>
          {isEditable && (
            <button
              onClick={() => onRemove(period.availabilityId)}
              style={{
                all: 'unset',
                color: '#dc3545',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#fee'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AvailabilityList;
