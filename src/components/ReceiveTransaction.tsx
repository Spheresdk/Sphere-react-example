import { useMemo } from 'react';
import { useSphere } from 'sphere-connect';

export const ReceiveTransaction = () => {
    const { wallet, balance } = useSphere();
    const address = wallet?.getAddress() || '';

    // Extract token name from coinType (e.g., "0x1::cedra_coin::CedraCoin" -> "Cedra")
    const tokenName = useMemo(() => {
        if (!balance?.coinType) return 'Cedra';
        const parts = balance.coinType.split('::');
        if (parts.length >= 3) {
            // Get the last part (e.g., "CedraCoin") and remove "Coin" suffix
            const coinName = parts[2].replace(/Coin$/i, '');
            return coinName;
        }
        return 'Cedra';
    }, [balance?.coinType]);

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ margin: 0, color: '#888', fontSize: '0.875rem' }}>
                Share your address to receive {tokenName} tokens
            </p>

            <div style={{
                borderBottom: '1px solid #2a2a2a',
                paddingBottom: '1rem',
                marginBottom: '1rem'
            }}>
                <div style={{
                    fontSize: '0.75rem',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.5rem',
                    fontWeight: 600
                }}>
                    Your Address
                </div>
                <div style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: '#4a9eff',
                    wordBreak: 'break-all',
                    marginBottom: '0.75rem',
                    lineHeight: 1.5
                }}>
                    {address}
                </div>
                <button
                    onClick={handleCopy}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.625rem 1rem',
                        background: '#1a1a1a',
                        border: '1px solid #222',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        justifyContent: 'center'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy Address
                </button>
            </div>
        </div>
    );
};
