import React, { useState, useEffect } from 'react';
import '../stylefiles/Header.css';
import logo from '../asserts/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (section) => {
    setActiveLink(section);
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <img src={logo} alt="vv" className="logo-spin" />
      </div>
      <button className="menu-toggle" onClick={handleMenuToggle}>
        <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
      </button>
      <nav>
        <ul className={isMenuOpen ? 'active' : ''}>
          {['home', 'services', 'about', 'contact'].map((item) => (
            <li key={item}>
              <a
                href={`#${item}`}
                className={`nav-link ${activeLink === item ? 'active' : ''}`}
                onClick={() => handleNavClick(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
