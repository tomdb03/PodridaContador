// Global Imports
import React from "react";

import FooterStyles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={FooterStyles.FooterContainer}>
      <p className={FooterStyles.FooterText}>Tom&aacute;s Dalla Bona. Reglamento de la podrida <a href="http://www.acanomas.com/Reglamentos-Juegos-de-Naipes/1226/Podrida.htm" className={FooterStyles.FooterLink}>ac&aacute;</a>.</p>
    </footer>
  );
};

export default Footer;