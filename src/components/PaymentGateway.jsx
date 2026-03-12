import React, { useState } from 'react';
import './PaymentGateway.css';

export default function PaymentGateway({ amount, causeLabel, onSuccess, onClose }) {
    const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success'

    const handlePayment = () => {
        setStatus('processing');
        // Simulate network delay
        setTimeout(() => {
            setStatus('success');
            // Wait briefly to show success checkmark before triggering the callback
            setTimeout(() => {
                onSuccess();
            }, 1000);
        }, 1500);
    };

    return (
        <div className="payment-gateway-overlay" onClick={status === 'idle' ? onClose : undefined}>
            <div className="payment-gateway-card" onClick={e => e.stopPropagation()}>
                <div className="pg-header">
                    <div className="pg-logo">
                        <span>🐾</span> PawSafe Secure Pay
                    </div>
                    {status === 'idle' && (
                        <button className="pg-close" onClick={onClose}>&times;</button>
                    )}
                </div>

                {status === 'idle' && (
                    <>
                        <div className="pg-amount">₹{parseInt(amount).toLocaleString('en-IN')}</div>
                        <div className="pg-cause">Donation for {causeLabel}</div>

                        <div className="pg-methods">
                            <button className="pg-method-btn" onClick={handlePayment}>
                                <span><span className="pg-method-icon">📱</span> UPI (GPay, PhonePe, Paytm)</span>
                                <span>&rarr;</span>
                            </button>
                            <button className="pg-method-btn" onClick={handlePayment}>
                                <span><span className="pg-method-icon">💳</span> Credit / Debit Card</span>
                                <span>&rarr;</span>
                            </button>
                            <button className="pg-method-btn" onClick={handlePayment}>
                                <span><span className="pg-method-icon">🏦</span> Net Banking</span>
                                <span>&rarr;</span>
                            </button>
                        </div>
                    </>
                )}

                {status === 'processing' && (
                    <div className="pg-processing">
                        <div className="pg-spinner"></div>
                        <p>Processing your payment...</p>
                        <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.5rem' }}>Please do not close this window.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="pg-success">
                        <div className="pg-check">✓</div>
                        <h3>Payment Successful!</h3>
                        <p>Thank you for your life-saving donation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
