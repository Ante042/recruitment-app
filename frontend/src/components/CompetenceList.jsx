const CompetenceList = ({ competenceProfiles, isEditable, onRemove }) => {
  if (competenceProfiles.length === 0) {
    return <p style={{ color: '#666', fontStyle: 'italic' }}>No competences added yet</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {competenceProfiles.map((profile) => (
        <div
          key={profile.competenceProfileId}
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
            <span style={{ fontWeight: '500' }}>{profile.Competence?.name || 'Unknown'}</span>
            <span style={{ color: '#666', marginLeft: '0.5rem' }}>
              ({profile.yearsOfExperience} {profile.yearsOfExperience === 1 ? 'year' : 'years'})
            </span>
          </div>
          {isEditable && (
            <button
              onClick={() => onRemove(profile.competenceProfileId)}
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

export default CompetenceList;
