import {NavLink} from 'react-router-dom';
import rightsReserved from '../../assets/landingPage/rightsReserved.svg';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__wrapper">
                <div className="footer__links">
                    <ul className="footer__links__menu">
                        <li className="footer__links__menu__item" ><NavLink to="/TOU" className="footer__links__menu__link"><p>Terms of Use</p></NavLink></li>
                        <li className="footer__links__menu__item"><NavLink to="/privacy" className="footer__links__menu__link"><p>Privacy</p></NavLink></li>
                        <li className="footer__links__menu__item"><NavLink to="/about" className="footer__links__menu__link"><p>About Us</p></NavLink></li>
                    </ul>
                </div>
                <div className="footer__copyright"><p className="footer__copyright__image"><img src={rightsReserved} alt="rights-reserved" className="rights-reserved" /></p></div>
            </div>
        </footer>
    )
}