import { db, storage } from '../firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const API_URL = '/api';

export const emergencyApi = {
    getAll: async (status = '') => {
        const response = await fetch(`${API_URL}/emergencies?status=${status}`);
        const result = await response.json();
        return result.data || [];
    },
    submit: async (formData) => {
        const response = await fetch(`${API_URL}/emergencies`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        return result.data;
    },
    updateStatus: async (id, status, volunteerId = null) => {
        const response = await fetch(`${API_URL}/emergencies/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, volunteerId })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to update status');
        return result.data;
    },
    updateSessionStatus: async (id, status) => {
        const response = await fetch(`${API_URL}/emergencies/${id}/session-status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to update session status');
        return result.data;
    },
    updateLiveLocation: async (id, latitude, longitude) => {
        const response = await fetch(`${API_URL}/emergencies/${id}/location`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude })
        });
        return response.json();
    },
    getActiveSession: async (id) => {
        const response = await fetch(`${API_URL}/emergencies/${id}`);
        const result = await response.json();
        return result.data;
    }
};

export const volunteerApi = {
    updateLocation: async (id, lat, lng) => {
        const response = await fetch(`${API_URL}/volunteers/${id}/location`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude: lat, longitude: lng })
        });
        return response.json();
    },
    getOne: async (id) => {
        const response = await fetch(`${API_URL}/volunteers/${id}`);
        const result = await response.json();
        return result.data;
    }
};

export const chatApi = {
    send: async (rescueId, senderId, message) => {
        const response = await fetch(`${API_URL}/chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rescueId, senderId, message })
        });
        return response.json();
    },
    getMessages: async (rescueId) => {
        const response = await fetch(`${API_URL}/chats/${rescueId}`);
        const result = await response.json();
        return result.data || [];
    }
};


export const statsApi = {
    get: async () => {
        const rescuedSnap = await getDocs(query(collection(db, 'emergencies'), where('status', '==', 'resolved')));
        const pendingSnap = await getDocs(query(collection(db, 'emergencies'), where('status', '!=', 'resolved')));
        const adoptedSnap = await getDocs(collection(db, 'adoptions'));
        const donationsSnap = await getDocs(collection(db, 'donations'));
        const volunteersSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'volunteer')));

        let totalDonations = 0;
        donationsSnap.forEach(d => { totalDonations += (Number(d.data().amount) || 0) });

        return {
            totalRescued: rescuedSnap.size,
            pendingRescue: pendingSnap.size,
            adoptedCount: adoptedSnap.size,
            totalDonations,
            volunteerCount: volunteersSnap.size,
        };
    },
};

export const animalsApi = {
    getAll: async () => {
        const snap = await getDocs(collection(db, 'animals'));
        return snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    },
    getOne: async (id) => {
        const d = await getDoc(doc(db, 'animals', id));
        return d.exists() ? { _id: d.id, ...d.data() } : null;
    },
    update: async (id, body) => {
        await updateDoc(doc(db, 'animals', id), body);
        return { _id: id, ...body };
    },
};

export const donationsApi = {
    submit: async (body) => {
        const requestData = { ...body, createdAt: new Date().toISOString() };
        const docRef = await addDoc(collection(db, 'donations'), requestData);
        return { _id: docRef.id, ...requestData };
    },
};

export const ngoApi = {
    getAll: async (params = {}) => {
        const snap = await getDocs(collection(db, 'ngos'));
        return snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    },
};
