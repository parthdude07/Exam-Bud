import {Link, NavLink} from 'react-router-dom';
import downloadDocument from "../../assets/landingPage/downloadDocument.png";
import texture from "../../assets/landingPage/texture.svg";
import books from "../../assets/landingPage/books.svg";
import comment from "../../assets/landingPage/comment.svg";
import logo from "../../assets/landingPage/logo.svg";
import ExamBud from "../../assets/landingPage/ExamBud.svg";
import BoostGrade from "../../assets/landingPage/BoostGrade.jpg";
import dashpic from "../../assets/landingPage/dashpic.png"
import discussions from "../../assets/landingPage/discussions.jpg";
import notes from "../../assets/landingPage/notes.png";
import './LandingPage.css';


export default function LandingPage() {
    return (
        <div className="main hide__scrollbar">
            <div className="texture-wrapper"><img src={texture} alt="texture" className="texture"/></div>
            <div className="hero">
                <h1 className="hero__title">
                    Everything You Need<br/>
                    To Start Acing Your Exams
                </h1>
                <p className="hero__description">
                    Your go-to platform for sharing notes, PDFs, and study materials with your branch and<br/>
                    semester. Collaborate, discuss, and conquer your exams together.
                </p>
                <Link to="/login" className="hero__btn">Get Started</Link>
            </div>
            <div className="features">
                <div className="feature__card">
                    <div className="feature__card__text">
                        <p className="feature__card__title">IOS & Android</p>
                        <p className="feature__card__description">
                            Learn wherever and<br/>
                            whenever you want - get<br/>
                            our website now!
                        </p>
                    </div>
                    <img src={dashpic} alt="dashpic" className="feature__card__img"/>
                </div>
                <div className="feature__card">
                    <div className="feature__card__text">
                        <p className="feature__card__title">Community</p>
                        <p className="feature__card__description">
                            Ask answer and succeed:<br/>
                            The ultimate study<br/>
                            community.
                        </p>
                    </div>
                    <img src={discussions} alt="discussions" className="feature__card__img"/>
                </div>
                <div className="feature__card">
                    <div className="feature__card__text">
                        <p className="feature__card__title">
                            Shared Documents
                        </p>
                        <p className="feature__card__description">
                            Prep like a pro with<br/>
                            +1M study resources.<br/>
                            Real Student notes,<br/>
                            past exams & more!
                        </p>
                    </div>
                    <img src={notes} alt="notes" className="feature__card__img"/>
                </div>
            </div>
            <div className='subheader'>
                <h2 className="subheader__title">
                    Your career starts here: Resources,<br/>
                    tools, and tips
                </h2>
                <Link to="/login" className="btn">Start Learning Now</Link>
            </div>
            <div className="card-container">
                <div className="card--blue">
                    <p className="card__title">Study Resources</p>
                    <p className="card--blue__description">
                        Notes, chapter breakdowns,<br/>
                        and key concepts for every<br/>
                        subject—quick, clear, and<br/>
                        syllabus-aligned.
                    </p>
                    <div className="card__icon-container">
                        <img src={books} alt="books" className="card__icon"/>
                    </div>

                </div>
                <div className="card--white">
                    <p className="card__title--blue">No ads</p>
                    <p className="card--white__description">
                        Study distraction-free: Enjoy a<br/>
                        no-ads experience!
                    </p>
                    <Link to="/login" className="card__btn--purple">Study Now</Link>
                </div>
                <div className="card--white">
                    <p className="card__title--blue">Post anonymously</p>
                    <p className="card--white__description">
                        Share notes, not names.<br/>
                        Anonymous notes & posting.
                    </p>
                    <Link to="/discussions" className="card__btn--blue">
                        <img src={comment} alt="comment" className="card__icon--blue" />
                    </Link>
                </div>
                <div className="card--blue">
                    <p className="card__title">Download documents</p>
                    <p className="card--blue__description">
                        No Wi-Fi? No problem!<br/>
                        Download study materials to<br/>
                        learn offline.
                    </p>
                    <img src={downloadDocument} alt="books" className="card__img"/>
                </div>
            </div>
            <div className='subheader'>
                <Link to="/login" className="btn">Start Learning Now</Link>
            </div>
            <div className="footer__card">
                <div className="img__wrapper">
                    <div className="filler"></div>
                    <img src={BoostGrade} alt="BoostGrade" className="footer__card__img"/>
                </div>
                <div className="footer__card__text">
                    <p className="footer__card__description">
                        Take the first step-<br/>
                        Join now and boost<br/>
                        your grades!
                    </p>
                    <Link to="/login" className="footer__card__btn">Sign up for free</Link>
                </div>
            </div>
            <div className="pre-footer">
                <img src={logo} alt="logo" className="pre-footer__logo"/>
                <img src={ExamBud} alt="ExamBud" className="pre-footer__logo__text"/>
            </div>
        </div>
    );
}