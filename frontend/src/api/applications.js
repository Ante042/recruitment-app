import client from './client';

export const getCompetences = async () => {
  const response = await client.get('/applications/competences');
  return response.data;
};

export const getMyProfile = async () => {
  const response = await client.get('/person/me');
  return response.data;
};

export const getMyApplication = async () => {
  const response = await client.get('/applications/me');
  return response.data;
};

export const addCompetence = async (data) => {
  const response = await client.post('/applications/competences', data);
  return response.data;
};

export const deleteCompetence = async (competenceProfileId) => {
  await client.delete(`/applications/competences/${competenceProfileId}`);
};

export const addAvailability = async (data) => {
  const response = await client.post('/applications/availability', data);
  return response.data;
};

export const deleteAvailability = async (availabilityId) => {
  await client.delete(`/applications/availability/${availabilityId}`);
};

export const submitApplication = async () => {
  const response = await client.post('/applications');
  return response.data;
};

export const getApplications = async () => {
  const response = await client.get('/applications');
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await client.get(`/applications/${id}`);
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await client.patch(`/applications/${id}/status`, { status });
  return response.data;
};
