import { useState } from 'react';
import { useSphere, type Network } from '@sphere/connect';
import { SPHERE_CONFIG } from '../config/sphere';

export const NetworkSwitcher = () => {
    const { sdk } = useSphere();
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentNetwork, setCurrentNetwork] = useState<Network>(
        (SPHERE_CONFIG.network as Network) || 'testnet'
    );

    const handleNetworkChange = async (network: Network) => {
        try {
            setCurrentNetwork(network);
            setShowDropdown(false);

            // Get the appropriate RPC endpoint for the network
            const rpcEndpoints: Record<Network, string> = {
                mainnet: 'https://mainnet.cedra.dev/v1',
                testnet: 'https://testnet.cedra.dev/v1',
                devnet: 'https://devnet.cedra.dev/v1'
            };

            // Update the network in the SDK
            await sdk.updateNetwork(network, rpcEndpoints[network]);

            console.log(`Network switched to ${network}. To persist this change, update the config file.`);
        } catch (error) {
            console.error('Failed to switch network:', error);
        }
    };

    const getNetworkColor = (network: Network) => {
        switch (network) {
            case 'mainnet': return '#ef4444';
            case 'testnet': return '#22c55e';
            case 'devnet': return '#3b82f6';
            default: return '#22c55e';
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 500
                }}
            >
                <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getNetworkColor(currentNetwork)
                }}></span>
                <span style={{ textTransform: 'capitalize' }}>{currentNetwork}</span>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>▼</span>
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div
                        onClick={() => setShowDropdown(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 999
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: '140px',
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        zIndex: 1001,
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
                    }}>
                        {(['mainnet', 'testnet', 'devnet'] as const).map((network) => (
                            <button
                                key={network}
                                onClick={() => handleNetworkChange(network)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: currentNetwork === network ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                    border: 'none',
                                    color: currentNetwork === network ? '#fff' : '#888',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                    textTransform: 'capitalize'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentNetwork !== network) {
                                        e.currentTarget.style.background = '#222';
                                        e.currentTarget.style.color = '#fff';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentNetwork !== network) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#888';
                                    }
                                }}
                            >
                                <span style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: getNetworkColor(network)
                                }}></span>
                                {network}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
