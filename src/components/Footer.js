import React, { useState } from "react";
import { Link } from "gatsby";
import SocialIcons from "./SocialIcons.js";
import SiteMetaData from "./SiteMetadata";
import { LinkFix } from "./SimpleFunctions";

const Footer = () => {
  const [footerBarActiveClass, setFooterBarActiveClass] = useState("");
  const [footerActive, setFooterActive] = useState(false);
  const { title, logoLarge, footerNav, dmca, dmcaLink } = SiteMetaData();
  const img = logoLarge?.base;
  const imgWidth = logoLarge.childImageSharp?.original?.width;
  const imgHeight = logoLarge.childImageSharp?.original?.height;

  const toggleFooterHamburger = () => {
    !footerActive ? setFooterBarActiveClass("is-active") : setFooterBarActiveClass("");
    setFooterActive(!footerActive);
  };

  return (
    <footer className="footer">
      <div className="footer-bottom">
        <div className="footer-logo has-text-centered">
          <div className="logo-container">
            <Link to="/">
              <img src={`/img/${img}`} alt={title} loading="lazy" width={imgWidth} height={imgHeight} />
            </Link>
          </div>
        </div>
        {/* Hamburger menu */}
        <div className="footernav has-text-centered">
          {/* eslint-disable */}
          <div className={`footer-burger burger ${footerBarActiveClass}`} data-target="footerMenu" onClick={() => toggleFooterHamburger()}>
            <span />
            <span />
            <span />
          </div>

          {/* eslint-enable */}
          <div id="footerMenu" className={`footer-menu ${footerBarActiveClass}`}>
            <div className="footerbar">
              {footerNav.map((item, index) => {
                return (
                  <Link className="footerbar-item" to={LinkFix(item)} key={index}>
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
          <SocialIcons />
          <div className="footer-text">
            {dmca && (
              <div className="protected-img">
                <a href={dmcaLink}>
                  <img src="/useful-img/dmca.png" alt="DMCA.com Protection Status" loading="lazy" width="121" height="24" />
                </a>
              </div>
            )}
            <p>{title} © 2021. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
