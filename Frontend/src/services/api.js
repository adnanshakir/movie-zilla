const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = {
  get: (path) =>
    fetch(`${BASE_URL}${path}`, { credentials: 'include' }).then((r) => r.json()),

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  delete: (path) =>
    fetch(`${BASE_URL}${path}`, { method: 'DELETE', credentials: 'include' }).then((r) =>
      r.json(),
    ),
};

export default api;
