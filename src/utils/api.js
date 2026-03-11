import { db, storage } from '../firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const emergencyApi = {
    getAll: async () => {
        const q = query(collection(db, 'emergencies'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    },
    submit: async (formData) => {
        let imageUrl = '';
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            const storageRef = ref(storage, `emergencies/${Date.now()}_${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            animalType: formData.get('animalType'),
            issueType: formData.get('issueType'),
            location: formData.get('location'),
            urgency: formData.get('urgency'),
            notes: formData.get('notes'),
            imageUrl,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'emergencies'), data);
        return { _id: docRef.id, ...data };
    },
    updateStatus: async (id, status) => {
        const docRef = doc(db, 'emergencies', id);
        await updateDoc(docRef, { status });
        return { _id: id, status };
    },
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
