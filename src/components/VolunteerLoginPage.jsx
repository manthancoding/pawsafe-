import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import './LoginPage.css';

export default function VolunteerLoginPage({ onLoginSuccess, user }) {
    const navigate = useNavigate();
    const location = useLocation();

    // If already a volunteer, redirect to portal
    useEffect(() => {
        if (user && (user.roles?.includes('volunteer') || user.role === 'volunteer')) {
            window.location.href = 'http://localhost:5174';
        }
    }, [user]);

    const handleVolunteerLoginSuccess = (userData) => {
        if (onLoginSuccess) onLoginSuccess(userData);
        if (userData.roles?.includes('volunteer') || userData.role === 'volunteer') {
            window.location.href = 'http://localhost:5174';
        } else {
            // Not a volunteer yet, show upgrade option
            navigate('/become-volunteer');
        }
    };

    return (
        <div className="volunteer-login-wrapper">
            <div className="volunteer-hero-mini">
                <div className="container">
                    <h1>Volunteer Portal</h1>
                    <p>Log in to access your rescue dashboard and start helping animals.</p>
                </div>
            </div>
            <LoginPage
                onClose={() => navigate('/')}
                onLoginSuccess={handleVolunteerLoginSuccess}
                user={user}
            />
            <style dangerouslySetInnerHTML={{
                __html: `
                .volunteer-login-wrapper {
                    min-height: 100vh;
                    background: #f4f7f6;
                    padding-bottom: 3rem;
                }
                .volunteer-hero-mini {
                    background: linear-gradient(135deg, #0d7377 0%, #14b1ab 100%);
                    color: white;
                    padding: 4rem 1rem;
                    text-align: center;
                    margin-bottom: -4rem;
                }
                .volunteer-hero-mini h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }
                @media (max-width: 600px) {
                    .volunteer-hero-mini h1 { font-size: 1.8rem; }
                    .volunteer-hero-mini { padding: 3rem 1rem; }
                }
                .volunteer-hero-mini p {
                    font-size: 1.1rem;
                    opacity: 0.9;
                }
                .volunteer-login-wrapper .login-page {
                    background: transparent;
                    position: relative;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: auto;
                    display: block;
                    padding: 2rem 1rem;
                }
                .volunteer-login-wrapper .login-card {
                    margin: 0 auto;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
            `}} />
        </div>
    );
}
