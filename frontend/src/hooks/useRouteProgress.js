import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

const useRouteProgress = () => {
    const location = useLocation();

    useEffect(() => {

        NProgress.start();

        const timer = setTimeout(() => {
            NProgress.done();
        }, 200);

        return () => {
            clearTimeout(timer);
            NProgress.done();
        };
    }, [location.pathname]);
};

export default useRouteProgress;