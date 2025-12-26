import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSphere, SphereModal } from '@sphereorg/connect';
import { Dashboard } from './components/Dashboard';
import { Hero } from './components/Hero';
import { Callback } from './pages/Callback';
import './App.css';

function Sidebar() {
  const { wallet, email, sdk } = useSphere();
  const address = wallet?.getAddress() || '';

  const handleLogout = async () => {
    await sdk.logout();
    window.location.reload();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">Sphere Connect</div>

      <div className="sidebar-account">
        <div className="account-label">Main account</div>
        <div className="account-address">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{email?.split('@')[0] || 'User'}</div>
            <div className="user-email">{email || ''}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a1a1a';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#888';
            }}
            title="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileHeader() {
  const { sdk, email } = useSphere();

  const handleLogout = async () => {
    await sdk.logout();
    window.location.reload();
  };

  return (
    <div className="mobile-header">
      <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Sphere</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#888' }}>
          {email?.split('@')[0]}
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

function MainLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useSphere();

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <Hero onOpenModal={() => setIsModalOpen(true)} />
        <SphereModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <MobileHeader />
      <Sidebar />
      <Dashboard />
      <SphereModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
