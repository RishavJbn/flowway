const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all flows for the authenticated user.
 */
export async function fetchFlows(token) {
  const response = await fetch(`${API_URL}/flows`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch flows');
  }
  return response.json();
}

/**
 * Fetch a single flow by ID.
 */
export async function fetchFlow(id, token) {
  const response = await fetch(`${API_URL}/flows/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch flow');
  }
  return response.json();
}

/**
 * Create a new flow on the backend.
 */
export async function createFlow(flowData, token) {
  const response = await fetch(`${API_URL}/flows`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flowData),
  });
  if (!response.ok) {
    throw new Error('Failed to create flow');
  }
  return response.json();
}

/**
 * Update an existing flow on the backend.
 */
export async function updateFlow(id, flowData, token) {
  const response = await fetch(`${API_URL}/flows/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flowData),
  });
  if (!response.ok) {
    throw new Error('Failed to update flow');
  }
  return response.json();
}

/**
 * Delete a flow by ID.
 */
export async function deleteFlow(id, token) {
  const response = await fetch(`${API_URL}/flows/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete flow');
  }
  return response.json();
}
