const STATUS_MESSAGES = {
  400: 'Invalid request.',
  401: 'You must be logged in.',
  403: 'You do not have permission.',
  404: 'Resource not found.',
  409: 'Conflict - the resource already exists.',
  422: 'Validation failed.',
  500: 'Server error, please try again later.',
};

export function getErrorMessage(error) {
  if (!error) return 'An unknown error occurred.';
  if (error.response) {
    const { status, data } = error.response;
    return data?.message || STATUS_MESSAGES[status] || `Error ${status}.`;
  }
  if (error.request) return 'Network error - no response from server.';
  return error.message || 'An unexpected error occurred.';
}
