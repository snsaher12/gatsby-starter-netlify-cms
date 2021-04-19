import React from "react";
import { Link } from "gatsby";

const BreadCrumbs = ({ title, link, titleParent }) => {
  return (
    <div id="breadcrumbs" className="breadcrumbs">
      <div className="container">
        <div className="bread-item">
          <Link to="/">
            <span>Home</span>
          </Link>
          »
        </div>
        {titleParent && link ? (
          <div className="bread-item">
            <Link to={link}>
              <span>{titleParent}</span>
            </Link>
            »
          </div>
        ) : null}
        <div className="bread-item">
          <p>
            <span>{title}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumbs;
