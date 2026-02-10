import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { getApplicationById, updateApplicationStatus } from '../api/applications';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const fetchApplication = () => {
    setLoading(true);
    getApplicationById(id)
      .then(data => {
        setApplication(data);
        setSelectedStatus(data.status);
      })
      .catch(() => setError('Failed to load application.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    setUpdateError('');
    try {
      await updateApplicationStatus(id, selectedStatus);
      fetchApplication();
    } catch {
      setUpdateError('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem', color: '#dc2626' }}>{error}</div>;
  if (!application) return null;

  const person = application.Person;
  const competences = person?.CompetenceProfiles ?? [];
  const availabilities = person?.Availabilities ?? [];

  return (
    <div style={{ maxWidth: '700px', width: '100%', padding: '2rem', alignSelf: 'flex-start' }}>
      <button
        onClick={() => navigate('/recruiter')}
        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.875rem', padding: 0, marginBottom: '1.5rem' }}
      >
        ← Back to dashboard
      </button>

      <h1 style={{ marginBottom: '1.5rem' }}>Application Detail</h1>

      <div style={{ backgroundColor: '#f8f9fa', padding: '1.25rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Applicant</h3>
        <p style={{ margin: '0.25rem 0' }}><strong>Name:</strong> {person?.firstName} {person?.lastName}</p>
        <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {person?.email}</p>
        <p style={{ margin: '0.25rem 0' }}><strong>Person number:</strong> {person?.personNumber ?? '—'}</p>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '1.25rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Competences</h3>
        {competences.length === 0 ? (
          <p style={{ color: '#666', margin: 0 }}>None</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0' }}>Competence</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>Years of experience</th>
              </tr>
            </thead>
            <tbody>
              {competences.map(cp => (
                <tr key={cp.competenceProfileId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem 1rem 0.5rem 0' }}>{cp.Competence?.name}</td>
                  <td style={{ padding: '0.5rem 0' }}>{cp.yearsOfExperience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '1.25rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Availability</h3>
        {availabilities.length === 0 ? (
          <p style={{ color: '#666', margin: 0 }}>None</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0' }}>From</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>To</th>
              </tr>
            </thead>
            <tbody>
              {availabilities.map(a => (
                <tr key={a.availabilityId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem 1rem 0.5rem 0' }}>{a.fromDate}</td>
                  <td style={{ padding: '0.5rem 0' }}>{a.toDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '1.25rem', borderRadius: '4px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Status</h3>
        <div style={{ marginBottom: '1rem' }}>
          <StatusBadge status={application.status} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
          >
            <option value="unhandled">Unhandled</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button
            onClick={handleUpdate}
            disabled={updating || selectedStatus === application.status}
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            {updating ? 'Updating...' : 'Update'}
          </Button>
        </div>
        {updateError && <p style={{ color: '#dc2626', marginTop: '0.5rem', marginBottom: 0 }}>{updateError}</p>}
      </div>
    </div>
  );
};

export default ApplicationDetail;
