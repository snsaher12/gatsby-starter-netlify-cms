import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BreadCrumbs from "../components/BreadCrumbs.js";
import SiteMetaData from "./SiteMetadata";
import CookieConsent from "react-cookie-consent";
import "../css/main.css";

const TemplateWrapper = (props) => {
  const { children, title, titleParent, link } = props;
  const {
    colors: { background, blockBackground, headerBackground, textColor, btnBackground, btnHoverBackground, btnColor, navbarShadow, headerTextColor },
    cookies,
  } = SiteMetaData();

  return (
    <div>
      <style>
        {`
          :root {
            --default-box-shadow: 0px 0px 3px 0px ${navbarShadow};
            --custom-color-1: ${background};
            --custom-color-2: ${blockBackground};
            --custom-color-3: ${headerBackground};
            --custom-color-4: ${textColor};
            --custom-color-5: ${btnBackground};
            --custom-color-6: ${btnHoverBackground};
            --custom-color-7: ${btnColor};
            --custom-color-8: ${headerTextColor || "#fff"}
          }
      `}
      </style>
      <Navbar />
      {title && <BreadCrumbs title={title} titleParent={titleParent} link={link} />}
      {children}
      {cookies?.enabled && (
        <CookieConsent buttonClasses="su-button button-cookie" buttonWrapperClasses="button-wrapper-cookie" disableButtonStyles={true}>
          {cookies?.message}
        </CookieConsent>
      )}
      <Footer />
    </div>
  );
};

export default TemplateWrapper;
