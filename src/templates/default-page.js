import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import HeadData from "../components/HeadData.js";
import SiteMetaData from "../components/SiteMetadata.js";
import { ReplaceTitle } from "../components/SimpleFunctions.js";

export const DefaultPageTemplate = ({ title, body, siteName, siteLink }) => {
  const url = new URL(siteLink);

  return (
    <section className="section default-page">
      <div className="container">
        <div className="content">
          <h1 className="title">{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: ReplaceTitle(body, { siteLinkNoProtocol: url.hostname, siteName, siteLink }) }} />
        </div>
      </div>
    </section>
  );
};

DefaultPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string,
  siteName: PropTypes.string,
};

const DefaultPage = ({ data }) => {
  const { title: siteName, siteURL, logoLarge } = SiteMetaData();
  const { markdownRemark: post } = data;
  const { title, seoTitle, seoDescription } = post.frontmatter;
  const slug = post.fields.slug;
  const pageType = post.frontmatter.templateKey;
  const {
    base,
    childImageSharp: {
      original: { width, height },
    },
  } = logoLarge;

  const aboutUsSchema = `{
    "@context":"https://schema.org",
    "@type":"AboutPage",
    "mainEntityOfPage":{
      "@type":"WebPage",
      "@id":"${siteURL + slug}/"
    },
    "url":"${siteURL + slug}/",
    "headline":"${title}",
    "description":"${seoDescription}",
    "image":{
      "@type":"ImageObject",
      "@id":"${siteURL + slug}/#primaryimage",
      "url":"${siteURL}/img/${base}",
      "width":"${width.toString()}",
      "height":"${height.toString()}"
    },
    "publisher":{
      "@type":"Organization",
      "name":"${siteName}",
      "logo":{
        "@type":"ImageObject",
        "url":"${siteURL}/img/${base}",
        "width":"${width.toString()}",
        "height":"${height.toString()}"
      }
    }
  },`;

  return (
    <Layout title={title}>
      <HeadData title={`${seoTitle} - ${siteName}`} description={seoDescription} schema={pageType === "about-page" ? aboutUsSchema : false} />
      <DefaultPageTemplate title={title} body={post.html} siteName={siteName} siteLink={siteURL} />
    </Layout>
  );
};

DefaultPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default DefaultPage;

export const defaultPageQuery = graphql`
  query DefaultPageByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      fields {
        slug
      }
      frontmatter {
        templateKey
        title
        seoTitle
        seoDescription
      }
    }
  }
`;
