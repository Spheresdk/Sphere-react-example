import { useEffect, useState } from 'react';
import { useSphere } from '@sphere/connect';
import { fetchAccountActivities } from '../services/indexer';

export const TransactionHistory = () => {
    // @ts-ignore - IndexerUrl coming from updated context
    const { wallet, indexerUrl } = useSphere();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!wallet) return;

            try {
                // If indexer is available, use it directly in the app
                if (indexerUrl) {
                    const activities = await fetchAccountActivities(indexerUrl, wallet.getAddress());
                    const mappedHistory = activities.map((activity: any) => {
                        const isDeposit = activity.type.includes('DepositEvent');
                        return {
                            hash: `0x${activity.transaction_version}`,
                            success: true,
                            type: activity.type.split('::').pop() || activity.type,
                            sender: isDeposit ? 'External' : wallet.getAddress(),
                            receiver: isDeposit ? wallet.getAddress() : 'External',
                            amount: activity.amount,
                            timestamp: Math.floor(new Date(activity.transaction_timestamp).getTime() / 1000),
                            version: activity.transaction_version.toString(),
                        };
                    });
                    setHistory(mappedHistory.slice(0, 10));
                } else {
                    // Fallback to SDK RPC-based history
                    const txs = await wallet.getTransactionHistory();
                    setHistory(txs.slice(0, 10));
                }
            } catch (err) {
                console.warn('History fetch failed', err);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 15000);
        return () => clearInterval(interval);
    }, [wallet, indexerUrl]);

    if (loading) {
        return (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>
                Loading activity...
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}>📭</div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>No activity found</div>
            </div>
        );
    }

    return (
        <div>
            {history.map((tx) => (
                <a
                    key={tx.hash}
                    href={`https://cedrascan.com/txn/${tx.hash}?network=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 0',
                        borderBottom: '1px solid #2a2a2a',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: tx.sender === wallet?.getAddress() ? '#1a1a1a' : 'rgba(34, 197, 94, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: tx.sender === wallet?.getAddress() ? '#fff' : '#22c55e'
                        }}>
                            {tx.sender === wallet?.getAddress() ? '↑' : '↓'}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.125rem' }}>
                                {tx.sender === wallet?.getAddress() ? 'Sent' : 'Received'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                {new Date(tx.timestamp * 1000).toLocaleDateString()} at {new Date(tx.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            marginBottom: '0.125rem',
                            color: tx.success ? '#fff' : '#ef4444'
                        }}>
                            {tx.success ? '✓' : '✗'} {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                            {tx.success ? 'Confirmed' : 'Failed'}
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
};
