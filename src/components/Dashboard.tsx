import { useState, useEffect } from 'react';
import { useSphere } from '@sphereorg/connect';
import { Modal } from './Modal';
import { SendTransaction } from './SendTransaction';
import { ReceiveTransaction } from './ReceiveTransaction';
import { TransactionHistory } from './TransactionHistory';
import { NetworkSwitcher } from './NetworkSwitcher';
import { fetchAccountBalances, fetchFungibleAssetInfo, type FungibleAssetInfo } from '../services/indexer';

export const Dashboard = () => {
    // @ts-ignore - The SDK types might need a rebuild to reflect the context change
    const { wallet, balance, email, indexerUrl } = useSphere();
    const [activeModal, setActiveModal] = useState<'send' | 'receive' | null>(null);
    const [activeTab, setActiveTab] = useState<'tokens' | 'activity'>('tokens');
    const [allTokens, setAllTokens] = useState<any[]>([]);
    const [selectedToken, setSelectedToken] = useState<any>(null);
    const [loadingTokens, setLoadingTokens] = useState(false);

    useEffect(() => {
        const fetchAllBalances = async () => {
            if (!wallet || !indexerUrl) return;
            try {
                const address = wallet.getAddress();
                const balances = await fetchAccountBalances(indexerUrl, address);

                if (balances.length > 0) {
                    const assetTypes = balances.map((b: any) => b.asset_type);
                    const metadata = await fetchFungibleAssetInfo(indexerUrl, assetTypes);

                    const enrichedBalances = balances.map((b: any) => {
                        const meta = metadata.find((m: FungibleAssetInfo) => m.asset_type === b.asset_type);
                        const decimals = meta?.decimals || 8;
                        const symbol = meta?.symbol || (b.asset_type.includes('cedra_coin') ? 'CED' : b.asset_type.split('::').pop());
                        const name = meta?.name || (b.asset_type.includes('cedra_coin') ? 'Cedra' : 'Unknown Token');

                        return {
                            ...b,
                            symbol,
                            name,
                            icon: meta?.icon_uri,
                            formatted: (Number(b.amount) / Math.pow(10, decimals)).toFixed(Math.min(decimals, 8))
                        };
                    });
                    setAllTokens(enrichedBalances);
                } else {
                    setAllTokens([]);
                }
            } catch (err) {
                console.error('Failed to fetch local tokens:', err);
            } finally {
                setLoadingTokens(false);
            }
        };

        fetchAllBalances();
        const interval = setInterval(fetchAllBalances, 10000); // Poll every 10s for new tokens
        return () => clearInterval(interval);
    }, [wallet, indexerUrl]);

    return (
        <div className="main-content">
            {/* Account Header */}
            <div className="dashboard-header-row">
                <div className="account-header">
                    <div className="account-title">Main account</div>
                    <div className="account-info">
                        ({email}) {wallet?.getAddress().slice(0, 6)}...{wallet?.getAddress().slice(-4)}
                    </div>
                </div>

                {/* Network Switcher */}
                <NetworkSwitcher />
            </div>

            {/* Balance Display */}
            <div className="balance-section">
                <h1 className="balance-amount">
                    {balance?.formatted || '0.00'}
                    <span style={{ fontSize: '1.2rem', color: '#666', marginLeft: '0.5rem', fontWeight: 400 }}>
                        {balance?.metadata?.symbol || 'CED'}
                    </span>
                </h1>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <button
                    className="action-btn"
                    onClick={() => setActiveModal('receive')}
                >
                    Receive ↓
                </button>
                <button
                    className="action-btn"
                    onClick={() => setActiveModal('send')}
                >
                    Send ↑
                </button>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'tokens' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tokens')}
                >
                    Tokens
                </button>
                <button
                    className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
                    onClick={() => setActiveTab('activity')}
                >
                    Activity
                </button>
            </div>

            {/* Content */}
            {activeTab === 'tokens' && (
                <div>
                    <h3 className="token-list-header">My tokens</h3>

                    {/* Always show primary balance first if indexer is loading or empty */}
                    {!allTokens.some(t => t.asset_type.includes('cedra_coin')) && (
                        <div
                            className="token-item"
                            onClick={() => {
                                setSelectedToken(null); // Explicitly null for primary
                                setActiveModal('send');
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="token-info">
                                <div className="token-icon">⚡</div>
                                <div>
                                    <div className="token-name">Cedra</div>
                                    <div className="token-symbol">CED</div>
                                </div>
                            </div>
                            <div className="token-balance">
                                <div className="token-amount">{balance?.formatted || '0.00'}</div>
                                <div className="token-value">$0.00</div>
                            </div>
                        </div>
                    )}

                    {loadingTokens && allTokens.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                            Loading tokens...
                        </div>
                    ) : allTokens.length > 0 ? (
                        allTokens.map((item, index) => {
                            // Skip Cedra if already shown as primary (though our check above handles it)
                            if (item.asset_type.includes('cedra_coin') && !allTokens.some(t => t.asset_type.includes('cedra_coin'))) return null;

                            return (
                                <div
                                    className="token-item"
                                    key={index}
                                    onClick={() => {
                                        setSelectedToken(item);
                                        setActiveModal('send');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="token-info">
                                        <div className="token-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {item.icon ? (
                                                <img src={item.icon} alt={item.symbol} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                            ) : (
                                                '⚡'
                                            )}
                                        </div>
                                        <div>
                                            <div className="token-name">{item.name}</div>
                                            <div className="token-symbol">{item.symbol}</div>
                                        </div>
                                    </div>
                                    <div className="token-balance">
                                        <div className="token-amount">{item.formatted}</div>
                                        <div className="token-value">$0.00</div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                            No other tokens found in indexer.
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'activity' && (
                <div>
                    <TransactionHistory />
                </div>
            )}

            {/* Send Modal */}
            <Modal
                isOpen={activeModal === 'send'}
                onClose={() => {
                    setActiveModal(null);
                    setSelectedToken(null);
                }}
                title="Send"
            >
                <SendTransaction
                    onClose={() => {
                        setActiveModal(null);
                        setSelectedToken(null);
                    }}
                    selectedToken={selectedToken}
                />
            </Modal>

            {/* Receive Modal */}
            <Modal
                isOpen={activeModal === 'receive'}
                onClose={() => setActiveModal(null)}
                title="Receive"
            >
                <ReceiveTransaction />
            </Modal>
        </div>
    );
};
