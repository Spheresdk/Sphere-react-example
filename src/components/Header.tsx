import { useState } from 'react';
import { useSphere, type Network } from 'sphere-connect';

export const Header = ({ onOpenModal }: { onOpenModal: () => void }) => {
    const { isAuthenticated, wallet, logout, sdk, refreshData } = useSphere();
    const [isNetworkOpen, setIsNetworkOpen] = useState(false);
    const [currentNetwork, setCurrentNetwork] = useState<Network>('testnet');

    const handleNetworkSelect = async (network: Network) => {
        let rpcUrl = 'https://testnet.cedra.dev/v1';

        if (network === 'devnet') {
            rpcUrl = 'https://devnet.cedra.dev/v1';
        } else if (network === 'mainnet') {
            rpcUrl = 'https://mainnet.cedra.dev/v1'; // Placeholder for future mainnet
        }

        await sdk.updateNetwork(network, rpcUrl);
        setCurrentNetwork(network);
        setIsNetworkOpen(false);
        if (wallet) {
            await refreshData();
        }
    };

    return (
        <header className="header">
            <div className="logo" onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }}>Sphere</div>

            <div className="header-right">
                <div className="network-selector" onClick={() => setIsNetworkOpen(!isNetworkOpen)}>
                    <div className="network-badge">
                        <span className={`network-dot ${currentNetwork}`}></span>
                        {currentNetwork}
                    </div>
                    {isNetworkOpen && (
                        <div className="network-dropdown">
                            <div
                                className={`network-option ${currentNetwork === 'testnet' ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); handleNetworkSelect('testnet'); }}
                            >
                                <span className="network-dot testnet"></span>
                                Testnet
                            </div>
                            <div
                                className={`network-option ${currentNetwork === 'devnet' ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); handleNetworkSelect('devnet'); }}
                            >
                                <span className="network-dot devnet"></span>
                                Devnet
                            </div>
                            <div
                                className={`network-option ${currentNetwork === 'mainnet' ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); handleNetworkSelect('mainnet'); }}
                            >
                                <span className="network-dot mainnet"></span>
                                Mainnet
                            </div>
                        </div>
                    )}
                </div>

                {!isAuthenticated ? (
                    <button className="connect-button" onClick={onOpenModal}>
                        Connect Wallet
                    </button>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="address-pill">
                            {wallet?.getAddress().slice(0, 6)}...{wallet?.getAddress().slice(-4)}
                        </div>
                        <button className="logout-btn" onClick={logout} title="Disconnect">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
