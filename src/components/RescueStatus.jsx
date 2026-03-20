import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { emergencyApi, chatApi } from '../utils/api';
import './VolunteerDashboard.css'; // Reusing styles for now, or we can create RescueStatus.css

export default function RescueStatus({ user }) {
    const { rescueId } = useParams();
    const navigate = useNavigate();
    const [rescue, setRescue] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [volunteerLoc, setVolunteerLoc] = useState(null);

    useEffect(() => {
        if (!rescueId) return;

        // 1. Listen to Rescue Request Status
        const unsubRescue = onSnapshot(doc(db, 'rescueRequests', rescueId), (docSnap) => {
            if (docSnap.exists()) {
                setRescue({ id: docSnap.id, ...docSnap.data() });
                setLoading(false);
            } else {
                setLoading(false);
            }
        });

        // 2. Listen to Chat Messages
        const qChat = query(
            collection(db, 'rescueChats'),
            where('rescueId', '==', rescueId)
        );
        const unsubChat = onSnapshot(qChat, (snapshot) => {
            const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
                .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
            setMessages(msgs);
        });

        // 3. Listen to Active Rescue Session (Status & Tracking)
        const unsubSession = onSnapshot(doc(db, 'activeRescues', rescueId), (docSnap) => {
            if (docSnap.exists()) {
                const sessionData = docSnap.data();
                setSession(sessionData);
                if (sessionData.currentLat && sessionData.currentLng) {
                    setVolunteerLoc({ latitude: sessionData.currentLat, longitude: sessionData.currentLng });
                }
            } else {
                setSession(null);
            }
        });

        return () => {
            unsubRescue();
            unsubChat();
            unsubSession();
        };
    }, [rescueId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !rescue) return;
        chatApi.send(rescue.id, user?.id || 'anonymous', newMessage).catch(console.error);
        setNewMessage('');
    };

    if (loading) return <div className="loading-screen">Loading Rescue Details...</div>;
    if (!rescue) return <div className="error-screen">Rescue Request Not Found</div>;

    const isAccepted = rescue.status === 'accepted';
    const isCompleted = rescue.status === 'completed';

    const getStatusLabel = () => {
        if (!session) return rescue.status.replace('_', ' ');
        if (session.status === 'on_the_way') return 'Rescuer is on the way';
        if (session.status === 'reached') return 'Rescuer has reached';
        return session.status.replace('_', ' ');
    };

    return (
        <div className="rescue-status-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <header className="rescue-header">
                <h1>🐾 Rescue Progress</h1>
                <p>Rescue ID: <strong>{rescueId}</strong></p>
                <div className={`status-badge status-${session?.status || rescue.status}`}>
                    {getStatusLabel().toUpperCase()}
                </div>
            </header>

            <main className="rescue-body" style={{ marginTop: '2rem' }}>
                <div className="rescue-info-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <h2>{rescue.animalType.toUpperCase()} - {rescue.issueType}</h2>
                    <p>📍 {rescue.location}</p>
                    <p>{rescue.details}</p>
                    {isAccepted && <p>✅ Rescuer is on the way!</p>}
                    {isCompleted && <p>🎉 Rescue Completed! Thank you for helping.</p>}
                </div>

                {isAccepted && (
                    <div className="tracking-section" style={{ marginTop: '2rem' }}>
                        <h3>🧭 Live Tracking</h3>
                        <div className="map-placeholder" style={{ height: '200px', background: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                            {volunteerLoc ? (
                                <div style={{ textAlign: 'center' }}>
                                    <p>Volunteer is at:</p>
                                    <strong>{volunteerLoc.latitude.toFixed(4)}, {volunteerLoc.longitude.toFixed(4)}</strong>
                                    <p>(Real Map would show moving marker here)</p>
                                </div>
                            ) : (
                                <p>Waiting for volunteer location updates...</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="chat-section" style={{ marginTop: '2rem', background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div className="chat-header" style={{ background: '#f8fafc', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <h3>💬 Chat with Rescuer</h3>
                    </div>
                    <div className="chat-messages" style={{ height: '300px', overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {messages.length === 0 && <p className="empty-chat" style={{ textAlign: 'center', color: '#a0aec0' }}>No messages yet.</p>}
                        {messages.map(m => (
                            <div key={m.id} className={`chat-message ${m.senderId === user?.id ? 'sent' : 'received'}`} style={{
                                alignSelf: m.senderId === user?.id ? 'flex-end' : 'flex-start',
                                background: m.senderId === user?.id ? '#0d7377' : '#edf2f7',
                                color: m.senderId === user?.id ? 'white' : '#2d3748',
                                padding: '0.65rem 0.9rem',
                                borderRadius: '12px',
                                maxWidth: '80%'
                            }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, display: 'block', opacity: 0.8 }}>{m.senderId === user?.id ? 'You' : 'Rescuer'}</span>
                                <p style={{ margin: 0 }}>{m.message}</p>
                            </div>
                        ))}
                    </div>
                    <form className="chat-input-row" onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem' }}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <button type="submit" style={{ background: '#0d7377', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700 }}>Send</button>
                    </form>
                </div>
            </main>

            <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>Back to Home</button>
        </div>
    );
}
