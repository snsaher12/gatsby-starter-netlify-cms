import React from "react";
import Layout from "../components/Layout";
import HeadData from "../components/HeadData.js";
import LatestPosts from "../components/LatestPosts.js";
import SiteMetaData from "../components/SiteMetadata.js";

const NotFoundPage = () => {
  const { title: siteName } = SiteMetaData();

  return (
    <Layout>
      <section className="section notfound-page">
        <HeadData title={`404 Page - ${siteName}`} description="Page not Found" />
        <div className="container content">
          <div className="notfound_top_section">
            <h1 className="notfound_title">NOT FOUND</h1>
            <p className="notfound_text">You just hit a route that doesn&#39;t exist... the sadness.</p>
          </div>
          <LatestPosts />
        </div>
      </section>
    </Layout>
  );
};

export default NotFoundPage;
