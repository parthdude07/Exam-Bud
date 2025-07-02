import { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../../styles/nprogress-custom.css';

NProgress.configure({
    showSpinner: false,
    speed: 500,
    minimum: 0.3,
});

const Loading = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        NProgress.start();
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev === '...') return '';
                return prev + '.';
            });
        }, 500);

        return () => {
            clearInterval(interval);
            NProgress.done();
        };
    }, []);

    return (
        <div className="loading-container" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            textAlign: 'center',
            backgroundColor: '#c6d5ff',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                marginBottom: '2rem',
                animation: 'logoFloat 3s ease-in-out infinite, logoGlow 2s ease-in-out infinite alternate'
            }}>
                <svg 
                    width="80" 
                    height="60" 
                    viewBox="0 0 55 41" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        filter: 'drop-shadow(0 4px 12px rgba(20, 45, 111, 0.3))'
                    }}
                >
                    <path 
                        d="M9.92578 17.826L10.0941 31.3483L28.4825 40.7632V26.8753L9.92578 17.826ZM47.3539 17.973L28.5447 26.8762V40.7642L47.2698 31.2759L47.3539 17.973Z" 
                        fill="#142D6F"
                        style={{
                            animation: 'pathDraw 2s ease-in-out infinite alternate'
                        }}
                    />
                    <path 
                        d="M27.8833 2.28882e-05L9.60138 8.88677L9.58937 8.88111L1.67277 12.8605L1.70128 12.8745H1.66547V24.3501C1.23587 24.3673 0.830444 24.5256 0.533165 24.792C0.235885 25.0585 0.0695247 25.4128 0.0685359 25.7816C0.0694972 26.1389 0.225726 26.4831 0.506722 26.7469C0.787717 27.0107 1.17331 27.1753 1.5882 27.2085L0.871831 29.109L-1.52588e-05 31.4218H1.74368H3.48737L2.61553 29.109L1.89916 27.2085C2.31405 27.1753 2.69964 27.0107 2.98064 26.7469C3.26163 26.4831 3.41786 26.1389 3.41882 25.7816C3.41877 25.4111 3.25172 25.0549 2.9526 24.7875C2.65347 24.5201 2.24539 24.3622 1.81364 24.3467V12.9294L28.5243 25.9826L36.9599 21.8701L36.9361 21.8588L54.5394 13.2386L46.8345 9.43032L29.3545 18.2609L26.064 16.6993L43.5648 7.79582L37.725 4.93989L20.0101 13.8264L17.0805 12.4361L35.0734 3.59625L27.8833 2.28882e-05Z" 
                        fill="#142D6F"
                        style={{
                            animation: 'pathDraw 2s ease-in-out infinite alternate-reverse'
                        }}
                    />
                </svg>
            </div>
            <div style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#142d6f',
                marginBottom: '1rem',
                letterSpacing: '0.5px'
            }}>
                Loading{dots}
            </div>
    
            <div style={{
                width: '60px',
                height: '60px',
                border: '3px solid rgba(20, 45, 111, 0.3)',
                borderTop: '3px solid #142d6f',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />

            <style jsx>{`
                @keyframes logoFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes logoGlow {
                    0% { filter: drop-shadow(0 4px 12px rgba(20, 45, 111, 0.3)); }
                    100% { filter: drop-shadow(0 6px 20px rgba(20, 45, 111, 0.5)); }
                }

                @keyframes pathDraw {
                    0% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                    
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loading;