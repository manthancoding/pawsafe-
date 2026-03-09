// Base API URL — reads from Vite env var, falls back to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic GET request
 * @param {string} path - e.g. '/emergencies'
 * @returns {Promise<any>} parsed response data
 */
export async function apiGet(path) {
    const res = await fetch(`${BASE_URL}${path}`);
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'API error');
    }
    return json.data;
}

/**
 * Generic POST request (JSON body)
 * @param {string} path
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function apiPost(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'API error');
    }
    return json.data;
}

/**
 * POST with FormData (for file uploads)
 * @param {string} path
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export async function apiPostForm(path, formData) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        body: formData, // No Content-Type header — let browser set multipart boundary
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'API error');
    }
    return json.data;
}

/**
 * PATCH request (JSON body)
 * @param {string} path
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function apiPatch(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'API error');
    }
    return json.data;
}

// ── Convenience helpers ────────────────────────────────────

export const emergencyApi = {
    getAll: () => apiGet('/emergencies'),
    submit: (formData) => apiPostForm('/emergencies', formData),
    updateStatus: (id, status) => apiPatch(`/emergencies/${id}/status`, { status }),
};

export const statsApi = {
    get: () => apiGet('/stats'),
};

export const animalsApi = {
    getAll: () => apiGet('/animals'),
    getOne: (id) => apiGet(`/animals/${id}`),
    update: (id, body) => apiPatch(`/animals/${id}`, body),
};

export const donationsApi = {
    submit: (body) => apiPost('/donations', body),
};

export const ngoApi = {
    getAll: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiGet(`/ngos${qs ? '?' + qs : ''}`);
    },
};
