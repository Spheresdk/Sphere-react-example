import type { SDKConfig, Network } from 'sphere-connect';

/**
 * Sphere SDK Configuration
 */
export const SPHERE_CONFIG: SDKConfig = {
    /** 
     * The network to connect to. 
     */
    network: (import.meta.env.VITE_NETWORK as Network) || 'testnet',

    /** 
     * Your Google OAuth Client ID.
     */
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '377346331020-00rs1eiqpe7f79ehts81t6p96qdipl77.apps.googleusercontent.com',

    /** 
     * The RPC endpoint URL. 
     */
    rpcEndpoint: import.meta.env.VITE_RPC_ENDPOINT || 'https://testnet.cedra.dev/v1',

    /**
     * Redirect URI for OAuth flows.
     */
    redirectUri: window.location.origin + '/callback',

    /**
     * GraphQL indexer endpoint for querying blockchain data.
     */
    indexerUrl: import.meta.env.VITE_INDEXER_URL || 'https://graphql.cedra.dev/v1/graphql'
};
