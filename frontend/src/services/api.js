import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : 'https://alumai-backend-ra3y.onrender.com',
  timeout: 30000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('alumai-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || "API Error";
    
    // If 401, clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('alumai-token');
      localStorage.removeItem('alumai-user');
      window.dispatchEvent(new Event('auth-expired'));
    }
    
    console.error("API Error:", message);
    throw { message };
  }
);

// ─── AUTH ────────────────────────────────────────────────
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  const data = response.data;
  localStorage.setItem('alumai-token', data.access_token);
  localStorage.setItem('alumai-user', JSON.stringify(data.user));
  return data;
};

export const logout = () => {
  localStorage.removeItem('alumai-token');
  localStorage.removeItem('alumai-user');
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('alumai-user');
    return user ? JSON.parse(user) : null;
  } catch { return null; }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('alumai-token');
};

export const verifyAuth = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ─── TICKETS ────────────────────────────────────────────────
export const getTickets = async (source) => {
  const response = await api.get(`/tickets/${source}`);
  return response.data;
};

export const getAllTicketsWithStats = async () => {
  const sources = ['servicenow', 'teams', 'outlook'];
  const results = await Promise.allSettled(
    sources.map(src => api.get(`/tickets/${src}`))
  );

  let allTickets = [];
  const sourceCounts = {};

  results.forEach((result, idx) => {
    const src = sources[idx];
    if (result.status === 'fulfilled') {
      const data = result.value.data;
      const tickets = data.data || [];
      allTickets = allTickets.concat(tickets);
      sourceCounts[src] = tickets.length;
    } else {
      sourceCounts[src] = 0;
    }
  });

  const total = allTickets.length;
  const resolved = allTickets.filter(t => t.status === 'Resolved' || t.status === 'Resolved ✅').length;
  const escalated = allTickets.filter(t => t.status === 'Escalated').length;
  const pending = allTickets.filter(t => !t.is_classified).length;

  const bySeverity = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  allTickets.forEach(t => {
    const sev = t.severity || t.priority || '';
    const normalized = sev.charAt(0).toUpperCase() + sev.slice(1).toLowerCase();
    if (bySeverity[normalized] !== undefined) bySeverity[normalized]++;
  });

  const classifiedTickets = allTickets.filter(t => t.is_classified && t.confidence_score != null);

  return { all: allTickets, sourceCounts, stats: { total, resolved, escalated, pending, bySeverity, classifiedTickets } };
};

export const getEscalatedTickets = async () => {
  const { all } = await getAllTicketsWithStats();
  return all.filter(t => t.status === 'Escalated');
};

export const classifyTicket = async (id) => {
  const response = await api.post(`/tickets/classify/${id}`);
  return response.data;
};

export const escalateTicket = async (id) => {
  const response = await api.post(`/tickets/escalate/${id}`);
  return response.data;
};

export const uploadTickets = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/tickets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ─── ASSISTANT ───────────────────────────────────────
export const sendMessage = async (ticketId, message) => {
  const response = await api.post('/assistant/message', { ticket_id: ticketId, message });
  return response.data;
};

export const finalizeRCA = async (id) => {
  const response = await api.post(`/assistant/finalize/${id}`);
  return response.data;
};

// ─── ASSETS ─────────────────────────────────────────────
export const getAssets = async () => {
  const response = await api.get('/assets/');
  return response.data;
};

export const uploadAssets = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/assets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};