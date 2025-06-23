const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getPastPolls() {
  const res = await fetch(`${API_URL}/polls`);
  if (!res.ok) throw new Error('Failed to fetch polls');
  return res.json();
}

export async function createPoll(poll) {
  const res = await fetch(`${API_URL}/polls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(poll),
  });
  if (!res.ok) throw new Error('Failed to create poll');
  return res.json();
}

export async function submitResponse(response) {
  const res = await fetch(`${API_URL}/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response),
  });
  if (!res.ok) throw new Error('Failed to submit response');
  return res.json();
}

export async function getPollById(id) {
  const res = await fetch(`${API_URL}/polls/${id}`);
  if (!res.ok) throw new Error('Failed to fetch poll');
  return res.json();
} 