import { useState, useMemo } from 'react';
import { useSphere } from '@sphereorg/connect';

interface SendTransactionProps {
    onClose: () => void;
    selectedToken?: any; // Token object from Dashboard
}

export const SendTransaction = ({ onClose, selectedToken }: SendTransactionProps) => {
    const { wallet, balance: primaryBalance, refreshData } = useSphere();
    // Use selectedToken if provided, otherwise fallback to primary balance (Cedra)
    const activeToken = selectedToken || primaryBalance;

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState<'input' | 'confirm'>('input');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');

    const tokenName = useMemo(() => {
        if (activeToken?.name) return activeToken.name;
        // Fallback parsing if name not explicit
        const type = activeToken?.coinType || activeToken?.asset_type;
        if (!type) return 'Cedra';
        const parts = type.split('::');
        if (parts.length >= 3) {
            return parts[2].replace(/Coin$/i, '');
        }
        return 'Cedra';
    }, [activeToken]);

    const tokenSymbol = useMemo(() => {
        return activeToken?.symbol || (activeToken?.metadata?.symbol) || 'CED';
    }, [activeToken]);

    const activeBalanceFormatted = useMemo(() => {
        return activeToken?.formatted || '0.00';
    }, [activeToken]);

    const handleNext = () => {
        if (!recipient || !amount) return;
        setStep('confirm');
    };

    const handleSend = async () => {
        if (!wallet) return;

        setIsSending(true);
        setError('');
        try {
            // Fetch fresh balance/decimals from chain to ensure precision matches validation logic
            const targetCoinType = activeToken?.asset_type || activeToken?.coinType;
            const balanceInfo = await wallet.getBalance(targetCoinType);
            const decimals = balanceInfo.decimals;

            console.log(`[SendTransaction] Using decimals: ${decimals} for ${targetCoinType}`);

            const amountInSubUnits = Math.floor(parseFloat(amount) * Math.pow(10, decimals));

            await wallet.sendTransaction({
                to: recipient,
                amount: amountInSubUnits,
                // Pass the asset identifier
                coinType: targetCoinType,
            });
            await refreshData();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Transaction failed');
        } finally {
            setIsSending(false);
        }
    };

    if (step === 'confirm') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: 'clamp(2rem, 8vw, 3rem)',
                        fontWeight: 300,
                        marginBottom: '0.5rem',
                        wordBreak: 'break-all'
                    }}>
                        {amount} {tokenSymbol}
                    </div>
                </div>

                <div style={{
                    background: '#0f0f0f',
                    border: '1px solid #2a2a2a',
                    borderRadius: '12px',
                    padding: '1rem'
                }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>To</div>
                        <div style={{ fontSize: '0.875rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            {recipient}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>Network fee</div>
                        <div style={{ fontSize: '0.875rem' }}>~0.0001 Cedra</div>
                    </div>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={() => setStep('input')}
                        disabled={isSending}
                        style={{
                            flex: 1,
                            background: '#1a1a1a',
                            border: '1px solid #2a2a2a',
                            color: '#fff',
                            padding: '0.875rem',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: isSending ? 'not-allowed' : 'pointer',
                            opacity: isSending ? 0.5 : 1
                        }}
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isSending}
                        style={{
                            flex: 1,
                            background: '#fff',
                            border: 'none',
                            color: '#000',
                            padding: '0.875rem',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: isSending ? 'not-allowed' : 'pointer',
                            opacity: isSending ? 0.5 : 1
                        }}
                    >
                        {isSending ? 'Sending...' : 'Confirm'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Amount Input */}
            <div>
                <input
                    type="number"
                    step="0.00000001"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontSize: 'clamp(2rem, 10vw, 3.5rem)',
                        fontWeight: 300,
                        outline: 'none',
                        textAlign: 'center'
                    }}
                />
            </div>

            {/* Token Selector */}
            <div style={{
                background: '#0f0f0f',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#222',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {activeToken?.icon ? (
                            <img src={activeToken.icon} alt={tokenSymbol} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : '⚡'}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{tokenName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{tokenSymbol}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem' }}>{activeBalanceFormatted}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}></div>
                </div>
            </div>

            {/* Recipient Input */}
            <div>
                <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#888',
                    fontWeight: 500
                }}>
                    Recipient
                </label>
                <input
                    type="text"
                    placeholder="Cedra address, Cedra Name, or email"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        background: '#0f0f0f',
                        border: '1px solid #2a2a2a',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                    onClick={onClose}
                    style={{
                        flex: 1,
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                        color: '#fff',
                        padding: '0.875rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={handleNext}
                    disabled={!recipient || !amount}
                    style={{
                        flex: 1,
                        background: '#fff',
                        border: 'none',
                        color: '#000',
                        padding: '0.875rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: !recipient || !amount ? 'not-allowed' : 'pointer',
                        opacity: !recipient || !amount ? 0.5 : 1
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
