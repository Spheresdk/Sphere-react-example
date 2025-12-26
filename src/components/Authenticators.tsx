import React from 'react';

export const Authenticators: React.FC = () => {
    return (
        <div className="authenticators-section">
            <div className="section-header">
                <span className="section-title">Your Authenticators</span>
                <button className="add-btn">+ Add more</button>
            </div>

            <div className="auth-item">
                <div className="auth-icon">📧</div>
                <div className="auth-text">
                    <span className="auth-label">Email</span>
                    <span className="active-session">Active Session</span>
                </div>
            </div>
        </div>
    );
};
