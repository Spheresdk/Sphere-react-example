# Sphere Account Abstraction SDK Documentation

Welcome to the Sphere Account Abstraction SDK. This guide will walk you through integrating Google-based "keyless" wallets on the Cedra Network using modern React patterns.

## Project Structure (Recommended)

To keep your codebase clean and graspable, we recommend following this arrangement:

```text
src/
├── pages/                # Pages & Routes
│   └── Callback.tsx      # Redirect handler (New!)
├── config/
│   └── sphere.ts         # SDK Configuration
├── components/
│   ├── LoginButton.tsx   # Connection logic
│   └── Dashboard.tsx     # Wallet actions & balances
└── services/
    └── indexer.ts        # Custom GraphQL queries (optional)
```

---

## 1. Installation

```bash
npm install @sphereorg/connect
```

---

## 2. Configuration (`src/config/sphere.ts`)

Centralize your network and OAuth settings. You will need a Google Client ID from the [Google Cloud Console](https://console.cloud.google.com/).

```typescript
import { SDKConfig } from '@sphere/connect';

export const SPHERE_CONFIG: SDKConfig = {
  network: 'testnet',
  rpcEndpoint: 'https://testnet.cedra.dev/v1',
  indexerUrl: 'https://graphql.cedra.dev/v1/graphql',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  // Required for the Redirect Flow
  redirectUri: window.location.origin + '/callback', 
};
```

---

## 3. Implementation

### **React Wrapper**
Wrap your `main.tsx` (Vite) or `layout.tsx` (Next.js) with the provider.

```tsx
import { SphereProvider } from '@sphere/connect';
import { SPHERE_CONFIG } from './config/sphere';

export default function Layout({ children }) {
  return (
    <SphereProvider config={SPHERE_CONFIG}>
      {children}
    </SphereProvider>
  );
}
```

### **Component Usage (`LoginButton.tsx`)**
Use the `useSphere` hook to manage the user session and access the wallet.

```tsx
import { useSphere } from '@sphere/connect';

export function LoginButton() {
  const { login, logout, isAuthenticated, wallet, email } = useSphere();

  if (isAuthenticated) {
    return (
      <div>
        <span>{email} ({wallet?.getAddress().slice(0, 6)}...)</span>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <button onClick={login}>Login with Google</button>;
}
```

---

## 4. Handling Redirects (The Callback Page)

If you configure a `redirectUri`, the SDK will perform a full-page redirect to Google. You must create a page at that URL to handle the response.

### **`src/pages/Callback.tsx`**
```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSphere } from '@sphere/connect';

export const Callback = () => {
  const { sdk } = useSphere();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const credential = params.get('id_token');

    if (credential) {
      sdk.handleGoogleResponse(credential).finally(() => navigate('/'));
    } else {
      navigate('/');
    }
  }, [sdk, navigate]);

  return <div>Connecting to Sphere...</div>;
};
```

---

## 5. Understanding the Flow (Routing & Auth)

The transition from "Login" to "Dashboard" is a collaborative process between your routing and the SDK state:

1.  **Direct Redirect**: When the user clicks login, they leave your app for Google.
2.  **The Relay**: Google sends them back to `/callback`. The `Callback` component processes the token and then calls `navigate('/')`.
3.  **The Switch**: In your `App.tsx` (or main layout), you should use the `isAuthenticated` state to determine what to show at the root `/` path:

```tsx
// src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SphereProvider, useSphere, SphereModal } from '@sphere/connect';
import { SPHERE_CONFIG } from './config/sphere';
import { Callback } from './pages/Callback';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';

function MainLayout() {
  const { isAuthenticated } = useSphere();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SWITCH: Show Dashboard if logged in, otherwise show Hero
  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <Hero onOpenModal={() => setIsModalOpen(true)} />
      ) : (
        <Dashboard />
      )}

      {/* The Modal handles the actual 'Login' button click */}
      <SphereModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <SphereProvider config={SPHERE_CONFIG}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </Router>
    </SphereProvider>
  );
}
```

---

## 6. On-Chain Smart Contracts

The SDK provides a simplified `sendTransaction` method for common transfers, while also exposing the underlying Cedra client for advanced Move calls.

### **Simplified Transfer**
```tsx
import { useSphere } from '@sphere/connect';

export function ActionButton() {
  const { wallet } = useSphere();

  const handleSend = async () => {
    if (!wallet) return;

    const tx = await wallet.sendTransaction({
      to: '0xDESTINATION_ADDRESS...',
      amount: 1000000, // 0.01 CED
      coinType: '0x1::cedra_coin::CedraCoin'
    });
    
    console.log("Transaction Hash:", tx.hash);
  };

  return <button onClick={handleSend}>Send CED</button>;
}
```

### **Sending Fungible Assets (USDT)**
For Fungible Assets (like USDT), simply pass the asset address as the `coinType`.

```tsx
const handleSendUSDT = async () => {
    await wallet.sendTransaction({
        to: '0xRECIPIENT...',
        amount: 1000000, // 1.0 USDT (6 decimals)
        coinType: '0xUSDT_ASSET_ADDRESS...'
    });
};
```

### **Advanced Move Calls**
```tsx
const client = wallet.getClient();
const account = wallet.getAccount();

const transaction = await client.transaction.build.simple({
  sender: account.accountAddress,
  data: {
    function: '0x1::message::set_message',
    functionArguments: ['Hello Cedra!'],
  },
});
```

## Features

- **Google Native**: Zero-barrier entry using Google OAuth.
- **Modern Responsive UI**: SphereModal features a sharp-corner, responsive square design (`1:1` aspect ratio).
- **Redirect Support**: Built-in support for standard OAuth2 redirect flows (Mobile & Safari friendly).
- **Keyless Architecture**: Uses deterministic key derivation (PBKDF2) and session-bound ephemeral keys.
- **Deterministic**: Same Google user always gets the same wallet address.
- **Cross-Platform**: Works seamlessly in any modern browser environment.
