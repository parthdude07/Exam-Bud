import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Branch from './pages/Branch';
import Semester from './pages/Semester';
import Subject from './pages/Subject';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/landingPage/LandingPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

export default function App() {
    const location = useLocation();

    const hideHeaderFooter = location.pathname === '/404'; // or match more robustly if needed

    return (
        <>
            {!hideHeaderFooter && <Header />}
            <main className="main-content">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/branch/:branchId" element={<Branch />} />
                    <Route path="/branch/:branchId/semester/:semesterId" element={<Semester />} />
                    <Route path="/branch/:branchId/semester/:semesterId/subject/:subjectId" element={<Subject />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </main>
            {!hideHeaderFooter && <Footer />}
        </>
    );
}
