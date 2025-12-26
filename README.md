# 🌐 Sphere Connect Example Application

This is a professional example application demonstrating the integration of the **Sphere Connect SDK**. It features Google Sign-in, deterministic wallet derivation, and real-time on-chain activity tracking.

## 🚀 Installation

To get started with this example in your own environment:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure the SDK**
   The SDK requires explicit configuration to ensure you have full control over the network environment. Navigate to `src/config/sphere.ts` and set your credentials.

3. **Run the Application**
   ```bash
   npm run dev
   ```

## 🛠 Configuration Guide

The SDK is designed to be developer-centric and requires primary configuration fields:

```typescript
export const SPHERE_CONFIG: SDKConfig = {
    // 1. Mandatory Network: 'mainnet' | 'testnet' | 'devnet'
    network: 'testnet',
    
    // 2. Mandatory RPC Endpoint: Your custom node or a community node
    rpcEndpoint: 'https://testnet.cedra.dev/v1',
    
    // 3. Mandatory Google Client ID: From your Google Cloud Console
    googleClientId: 'YOUR_GOOGLE_CLIENT_ID'
};
```

## 🌟 Key Features Demonstrated
- **Google Authentication**: Seamless onboarding using standard Google accounts.
- **Deterministic Wallets**: Every user gets the same address across different sessions.
- **Transaction History**: Real-time polling and display of on-chain interactions.
- **Event-Driven Architecture**: Listen to SDK events directly in your React components.

## 🧪 Testing Account Abstraction
1. Login with Google.
2. View your derived address and balance.
3. Use the "Send" button to simulate and then submit a transfer.
4. Watch the "Recent Activity" update automatically.

---
Built with ❤️ by the Sphere Team.
