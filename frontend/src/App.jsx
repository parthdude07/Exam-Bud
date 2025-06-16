import { Routes, Route, useLocation, matchRoutes } from 'react-router-dom';
import Home from './pages/Home';
import Branch from './pages/Branch';
import Semester from './pages/Semester';
import Subject from './pages/Subject';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/landingPage/LandingPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import NotFound from './pages/404/NotFound';

const routes = [
    { path: '/' },
    { path: '/home' },
    { path: '/branch/:branchId' },
    { path: '/branch/:branchId/semester/:semesterId' },
    { path: '/branch/:branchId/semester/:semesterId/subject/:subjectId' },
    { path: '/admin' },
];

export default function App() {
    const location = useLocation();

    const matched = matchRoutes(routes, location.pathname);

    const is404 = !matched;

    return (
        <>
            {!is404 && <Header />}
            <main className="main-content">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/branch/:branchId" element={<Branch />} />
                    <Route path="/branch/:branchId/semester/:semesterId" element={<Semester />} />
                    <Route path="/branch/:branchId/semester/:semesterId/subject/:subjectId" element={<Subject />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />}/>
                </Routes>
            </main>
            {!is404 && <Footer />}
        </>
    );

}
