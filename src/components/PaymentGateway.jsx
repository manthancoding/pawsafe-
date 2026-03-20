import React, { useState, useEffect, useRef } from 'react';
import './PaymentGateway.css';

export default function PaymentGateway({ amount, causeLabel, onSuccess, onClose }) {
    const [status, setStatus] = useState('idle'); // 'idle' | 'success'
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const buttonRef = useRef(null);
    const scriptInjected = useRef(false);

    useEffect(() => {
        if (scriptInjected.current) return;
        scriptInjected.current = true;

        // Dynamically load Razorpay Payment Button script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
        script.setAttribute('data-payment_button_id', 'pl_SRYug24IRSFhAm');
        script.async = true;

        if (buttonRef.current) {
            buttonRef.current.appendChild(script);
        }

        script.onload = () => setScriptLoaded(true);
    }, []);

    const handleConfirm = () => {
        setStatus('success');
        setTimeout(() => {
            onSuccess();
        }, 1500);
    };

    return (
        <div className="payment-gateway-overlay" onClick={status === 'idle' ? onClose : undefined}>
            <div className="payment-gateway-card" onClick={e => e.stopPropagation()}>
                <div className="pg-header">
                    <div className="pg-logo">
                        <span>💳</span> Razorpay Secure
                    </div>
                    {status === 'idle' && (
                        <button className="pg-close" onClick={onClose}>&times;</button>
                    )}
                </div>

                {status === 'idle' && (
                    <>
                        <div className="pg-amount">₹{parseInt(amount).toLocaleString('en-IN')}</div>
                        <div className="pg-cause">Contribution for {causeLabel}</div>

                        <div className="pg-real-button-container">
                            {!scriptLoaded && <div className="pg-loader-inner">Connecting to Secure Payment Gateway...</div>}
                            <form ref={buttonRef} className="razorpay-embed-container"></form>
                        </div>

                        {scriptLoaded && (
                            <div className="pg-verification-step">
                                <p className="pg-hint">After completing your payment in the Razorpay window, please click below to sync with PawSafe:</p>
                                <button className="pg-confirm-btn" onClick={handleConfirm}>
                                    Confirm & Finalize Adoption/Donation
                                </button>
                            </div>
                        )}
                    </>
                )}

                {status === 'success' && (
                    <div className="pg-success">
                        <div className="pg-check">✓</div>
                        <h3>Payment Verified!</h3>
                        <p>Your contribution has been successfully recorded.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
