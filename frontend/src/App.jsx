import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from "react";
import Loading from './utils/Global-Loading/Loading';
import useRouteProgress from './hooks/useRouteProgress.js';
import './styles/nprogress-custom.css';
const Home = lazy(() => import('./pages/Home'));
const Branch = lazy(() => import('./pages/Branch'));
const Semester = lazy(() => import('./pages/Semester'));
const Subject = lazy(() => import('./pages/Subject'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/404/NotFound'));

export default function App() {
    
    useRouteProgress();

    return (
        <>
            <main className="main-content">
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/branch/:branchId" element={<Branch />} />
                        <Route path="/branch/:branchId/semester/:semesterId" element={<Semester />} />
                        <Route path="/branch/:branchId/semester/:semesterId/subject/:subjectId" element={<Subject />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="*" element={<NotFound />}/>
                    </Routes>
                </Suspense>
            </main>
        </>
    );
}
