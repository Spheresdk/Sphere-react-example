import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSphere, SphereModal } from 'sphere-connect';
import { Hero } from '../components/Hero';

export const Callback = () => {
    const { sdk, setIsLoading } = useSphere();
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            try {
                // Show the loading state on the modal
                setIsLoading(true);

                // Extract credential
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const searchParams = new URLSearchParams(window.location.search);
                const credential = hashParams.get('id_token') || searchParams.get('credential');

                if (credential) {
                    await sdk.handleGoogleResponse(credential);
                }
            } catch (error: any) {
                console.error('Authentication failed:', error.message);
            } finally {
                // Navigate home
                navigate('/');
            }
        };

        handleAuth();
    }, [navigate, sdk, setIsLoading]);

    // Keep the same look as the Home page but with the Modal forced open
    return (
        <div className="app-container">
            <Hero onOpenModal={() => { }} />
            <SphereModal
                isOpen={true}
                onClose={() => navigate('/')}
            />
        </div>
    );
};
