import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import CompetenceList from '../components/CompetenceList';
import AvailabilityList from '../components/AvailabilityList';
import {
  getCompetences,
  getMyProfile,
  getMyApplication,
  addCompetence,
  deleteCompetence,
  addAvailability,
  deleteAvailability,
  submitApplication
} from '../api/applications';

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [application, setApplication] = useState(null);
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [competenceForm, setCompetenceForm] = useState({ competenceId: '', yearsOfExperience: '' });
  const [availabilityForm, setAvailabilityForm] = useState({ fromDate: '', toDate: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      setErrors([]);

      const [competencesData, profileData, applicationData] = await Promise.all([
        getCompetences(),
        getMyProfile(),
        getMyApplication().catch(err => {
          if (err.response?.status === 404) return null;
          throw err;
        })
      ]);

      setCompetences(competencesData);
      setProfile(profileData);
      setApplication(applicationData);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrors(['Failed to load data. Please refresh the page.']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAddCompetence = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await addCompetence({
        competenceId: parseInt(competenceForm.competenceId),
        yearsOfExperience: parseFloat(competenceForm.yearsOfExperience)
      });
      setCompetenceForm({ competenceId: '', yearsOfExperience: '' });
      await loadData();
    } catch (error) {
      console.error('Error adding competence:', error);
      const message = error.response?.data?.error || error.response?.data?.errors?.[0] || 'Failed to add competence';
      setErrors([message]);
    }
  };

  const handleRemoveCompetence = async (competenceProfileId) => {
    setErrors([]);
    try {
      await deleteCompetence(competenceProfileId);
      await loadData();
    } catch (error) {
      console.error('Error removing competence:', error);
      const message = error.response?.data?.error || 'Failed to remove competence';
      setErrors([message]);
    }
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await addAvailability({
        fromDate: availabilityForm.fromDate,
        toDate: availabilityForm.toDate
      });
      setAvailabilityForm({ fromDate: '', toDate: '' });
      await loadData();
    } catch (error) {
      console.error('Error adding availability:', error);
      const message = error.response?.data?.error || error.response?.data?.errors?.[0] || 'Failed to add availability';
      setErrors([message]);
    }
  };

  const handleRemoveAvailability = async (availabilityId) => {
    setErrors([]);
    try {
      await deleteAvailability(availabilityId);
      await loadData();
    } catch (error) {
      console.error('Error removing availability:', error);
      const message = error.response?.data?.error || 'Failed to remove availability';
      setErrors([message]);
    }
  };

  const handleSubmit = async () => {
    setErrors([]);
    try {
      await submitApplication();
      await loadData();
    } catch (error) {
      console.error('Error submitting application:', error);
      const message = error.response?.data?.error || 'Failed to submit application';
      setErrors([message]);
    }
  };

  const isEditable = !application || application.status === 'unhandled';
  const hasSubmitted = !!application;
  const competenceProfiles = profile?.CompetenceProfiles || [];
  const availabilityPeriods = profile?.Availabilities || [];
  const canSubmit = competenceProfiles.length > 0 && availabilityPeriods.length > 0;

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', width: '100%', padding: '2rem', alignSelf: 'flex-start' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', width: '100%', padding: '2rem', alignSelf: 'flex-start' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Applicant Dashboard</h1>
        <Button onClick={handleLogout} style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Logout
        </Button>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' }}>
        <h2>Welcome, {user?.firstName} {user?.lastName}!</h2>
        <p>Username: {user?.username}</p>
      </div>

      {errors.length > 0 && (
        <div style={{ backgroundColor: '#fee', border: '1px solid #fcc', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          {errors.map((error, index) => (
            <p key={index} style={{ color: '#c00', margin: 0 }}>{error}</p>
          ))}
        </div>
      )}

      {hasSubmitted && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' }}>
          <h3>Application Status</h3>
          <div style={{ marginTop: '1rem' }}>
            <StatusBadge status={application.status} />
          </div>
          {isEditable ? (
            <p style={{ marginTop: '1rem', color: '#666' }}>
              You can still edit your application until a decision is made.
            </p>
          ) : (
            <p style={{ marginTop: '1rem', color: '#666' }}>
              Application locked - no further changes allowed.
            </p>
          )}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' }}>
        <h3>Competences</h3>
        <div style={{ marginTop: '1rem' }}>
          <CompetenceList
            competenceProfiles={competenceProfiles}
            isEditable={isEditable}
            onRemove={handleRemoveCompetence}
          />
        </div>

        {isEditable && (
          <form onSubmit={handleAddCompetence} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
            <h4>Add Competence</h4>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Competence:
                  <select
                    value={competenceForm.competenceId}
                    onChange={(e) => setCompetenceForm({ ...competenceForm, competenceId: e.target.value })}
                    required
                    style={{ width: '100%', height: '38px', marginTop: '0.25rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box', padding: '0 0.5rem' }}
                  >
                    <option value="">Select a competence</option>
                    {competences.map((comp) => (
                      <option key={comp.competenceId} value={comp.competenceId}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Years:
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={competenceForm.yearsOfExperience}
                      onChange={(e) => setCompetenceForm({ ...competenceForm, yearsOfExperience: e.target.value })}
                      required
                      style={{ width: '150px', height: '38px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box', padding: '0 0.5rem' }}
                    />
                    <button type="submit" style={{ all: 'unset', height: '38px', padding: '0 1rem', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer', boxSizing: 'border-box' }}>
                      Add
                    </button>
                  </div>
                </label>
              </div>
            </div>
          </form>
        )}
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' }}>
        <h3>Availability</h3>
        <div style={{ marginTop: '1rem' }}>
          <AvailabilityList
            availabilityPeriods={availabilityPeriods}
            isEditable={isEditable}
            onRemove={handleRemoveAvailability}
          />
        </div>

        {isEditable && (
          <form onSubmit={handleAddAvailability} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
            <h4>Add Availability Period</h4>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  From Date:
                  <input
                    type="date"
                    value={availabilityForm.fromDate}
                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, fromDate: e.target.value })}
                    required
                    style={{ width: '100%', height: '38px', marginTop: '0.25rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box', padding: '0 0.5rem' }}
                  />
                </label>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  To Date:
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <input
                      type="date"
                      value={availabilityForm.toDate}
                      onChange={(e) => setAvailabilityForm({ ...availabilityForm, toDate: e.target.value })}
                      required
                      style={{ width: '200px', height: '38px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box', padding: '0 0.5rem' }}
                    />
                    <button type="submit" style={{ all: 'unset', height: '38px', padding: '0 1rem', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer', boxSizing: 'border-box' }}>
                      Add
                    </button>
                  </div>
                </label>
              </div>
            </div>
          </form>
        )}
      </div>

      {!hasSubmitted && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '4px' }}>
          <h3>Submit Application</h3>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            You must add at least one competence and one availability period before submitting.
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ marginTop: '1rem', width: 'auto' }}
          >
            Submit Application
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;
