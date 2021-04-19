import React from "react";
import { Helmet } from "react-helmet";
import SiteMetaData from "./SiteMetadata";
import { graphql, useStaticQuery, withPrefix } from "gatsby";
import { Location } from "@reach/router";

const HeadData = (props) => {
  const { siteURL, title: siteName, logoLarge, faviconSmall, faviconLarge } = SiteMetaData();
  const { title, description, image, schema, location } = props;

  const {
    allMarkdownRemark: { nodes: categories },
  } = useStaticQuery(graphql`
    query FindCategories {
      allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "category-page" } } }) {
        nodes {
          frontmatter {
            title
            slug
          }
        }
      }
    }
  `);
  const sitemapschema = `{
    "@context":"https://schema.org",
    "@graph":[
      ${categories.map(
        ({ frontmatter: category }) => `{
        "@context":"https://schema.org",
        "@type":"SiteNavigationElement",
        "@id":"#Primary",
        "name":"${category.title}",
        "url":"${siteURL}/${category.slug}/"
      }`
      )}
    ]}`;

  const index = props.index !== false;

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content="#fff" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={`${siteURL}/${`img/${image || logoLarge.base}`}`} />
      <meta property="og:url" content={location.href} data-baseprotocol={location.protocol} data-basehost={location.host} />
      <link rel="canonical" href={location.href} data-baseprotocol={location.protocol} data-basehost={location.host} />
      <meta name="twitter:card" content="" />
      <meta name="twitter:creator" content="" />
      <meta name="twitter:site" content={siteName} />
      <meta name="twitter:title" content={title} />
      <link rel="icon" type="image/png" href={`${withPrefix("/")}img/${faviconLarge.base}`} sizes="32x32" />
      <link rel="icon" type="image/png" href={`${withPrefix("/")}img/${faviconSmall.base}`} sizes="16x16" />
      <script type="application/ld+json">{sitemapschema}</script>
      {index ? <meta name="robots" content="index, follow" /> : <meta name="robots" content="noindex" />}
      {index && <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
      {index && <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
      {schema && <script type="application/ld+json">{schema}</script>}
      {props.children}
    </Helmet>
  );
};

export default (props) => <Location>{(locationProps) => <HeadData {...locationProps} {...props} />}</Location>;
