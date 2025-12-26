interface HeroProps {
    onOpenModal: () => void;
}

export const Hero = ({ onOpenModal }: HeroProps) => {
    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: '#fafafa',
            textAlign: 'center',
            position: 'relative',
            color: '#1a1a1a'
        }}>
            {/* Top Badge */}
            <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#666',
                marginBottom: '3rem',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
            }}>
                Next-Gen Account Abstraction
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <h1 style={{
                    fontSize: 'clamp(3rem, 10vw, 5rem)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: '-2px',
                    margin: '0 0 2rem 0',
                    color: '#1a1a1a'
                }}>
                    Self-Custody<br />Made Simple
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                    color: '#666',
                    maxWidth: '550px',
                    margin: '0 auto 3rem auto',
                    lineHeight: 1.7
                }}>
                    A secure, non-custodial wallet that uses your Google account to derive keys. No seed phrases, professional-grade security, instant access.
                </p>

                {/* CTA Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '5rem'
                }}>
                    <button
                        onClick={onOpenModal}
                        style={{
                            background: '#1a1a1a',
                            color: '#fff',
                            border: 'none',
                            padding: '1rem 2.5rem',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#000';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#1a1a1a';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Get Started
                    </button>
                    <button
                        onClick={() => window.open('https://docs.cedra.network', '_blank')}
                        style={{
                            background: 'transparent',
                            color: '#1a1a1a',
                            border: '1px solid #ccc',
                            padding: '1rem 2.5rem',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f0f0f0';
                            e.currentTarget.style.borderColor = '#999';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = '#ccc';
                        }}
                    >
                        Documentation
                    </button>
                </div>

                {/* Features */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '3rem',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            margin: '0 0 0.5rem 0',
                            color: '#1a1a1a'
                        }}>
                            Self-Custodial
                        </h3>
                        <p style={{
                            fontSize: '0.85rem',
                            color: '#666',
                            margin: 0,
                            lineHeight: 1.5
                        }}>
                            Private keys stay yours
                        </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            margin: '0 0 0.5rem 0',
                            color: '#1a1a1a'
                        }}>
                            Keyless
                        </h3>
                        <p style={{
                            fontSize: '0.85rem',
                            color: '#666',
                            margin: 0,
                            lineHeight: 1.5
                        }}>
                            No seed phrases needed
                        </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            margin: '0 0 0.5rem 0',
                            color: '#1a1a1a'
                        }}>
                            Enterprise
                        </h3>
                        <p style={{
                            fontSize: '0.85rem',
                            color: '#666',
                            margin: 0,
                            lineHeight: 1.5
                        }}>
                            Google powered auth
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
