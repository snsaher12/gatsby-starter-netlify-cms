import React from "react";
import PropTypes from "prop-types";
import Layout from "../components/Layout";
import HeadData from "../components/HeadData.js";
import { graphql, Link } from "gatsby";
import SiteMetaData from "../components/SiteMetadata.js";
import { FindAuthor, FillSpace } from "../components/SimpleFunctions.js";

const CategoryPage = (props) => {
  const { nodes: posts } = props.data.allMdx;
  const { siteURL, title: siteName, logoLarge } = SiteMetaData();
  const cPage = props.data.markdownRemark.frontmatter;
  const firstPost = posts[0];
  const fSlug = firstPost && firstPost.fields.slug;
  const { title, sdate, moddate, author } = (firstPost && firstPost.frontmatter) || {};
  const { base: img } = (firstPost && firstPost.frontmatter.featuredimage) || {};

  const articleSchema =
    firstPost &&
    `{
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${siteURL}${fSlug}/"
    },
    "headline": "${title}"  ,
    "image": [
      "${siteURL}/img/${img}"
     ],
    "datePublished": "${sdate}",
    "dateModified": "${moddate}",
    "author": {
      "@type": "Person",
      "name": "${author}"
    },
     "publisher": {
      "@type": "Organization",
      "name": "${siteName}",
      "logo": {
        "@type": "ImageObject",
        "url": "${siteURL}/img/${logoLarge.base}"
      }
    }
  }`;

  const { currentPage, numPages, slug } = props.pageContext;
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1 ? `${slug}/` : `${slug}/${currentPage - 1}/`;
  const nextPage = `${slug}/${currentPage + 1}/`;

  return (
    <Layout>
      <section className="section category-post">
        <HeadData title={`${cPage.seoTitle} - ${siteName}`} description={cPage.seoDescription} schema={articleSchema} />
        <div className="container content">
          <div className="category-top-section">
            <h1>{cPage.title}</h1>
            <p>{cPage.description}</p>
          </div>
          <div className="category-bottom-section">
            <div className="category-columns">
              {posts.map((post) => {
                const { title, author, date } = post.frontmatter;
                const { base: img, name: imgName } = post.frontmatter.featuredimage;
                const { width, height } = post.frontmatter.featuredimage.childImageSharp.original;
                const slug = post.fields.slug;
                const { authorName, authorLink } = FindAuthor(author);

                return (
                  <div className="category-column" key={post.id}>
                    <div className="category_box">
                      <div className="category_box_image">
                        <div className="featured-thumbnail">
                          <Link to={`${slug}/`}>
                            <picture>
                              <source srcSet={`/image/category/${imgName}.webp`} />
                              <img src={`/img/${img}`} alt={title} loading="lazy" width={width} height={height} />
                            </picture>
                          </Link>
                        </div>
                      </div>
                      <div className="category_box_title">
                        <Link to={`${slug}/`}>{title}</Link>
                      </div>
                      <div className="category_box_info">
                        {authorName && (
                          <>
                            <Link to={`/author${authorLink}/`}>{authorName}</Link> |{" "}
                          </>
                        )}
                        {date}
                      </div>
                    </div>
                  </div>
                );
              })}
              {FillSpace(posts.length, "category-column")}
            </div>
          </div>
          <div className="pagination">
            <div className="pag-prev">
              {!isFirst && (
                <Link to={`${prevPage}`} rel="prev">
                  ← Newer Posts
                </Link>
              )}
            </div>
            <div className="pag-next">
              {!isLast && (
                <Link to={`${nextPage}`} rel="next">
                  Older Posts →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

CategoryPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export default CategoryPage;

export const pageQuery = graphql`
  query CategoryPageByTag($id: String!, $category: String!, $skip: Int!, $limit: Int!) {
    allMdx(sort: { order: DESC, fields: [frontmatter___date] }, filter: { frontmatter: { category: { eq: $category } } }, limit: $limit, skip: $skip) {
      nodes {
        excerpt(pruneLength: 400)
        id
        fields {
          slug
        }
        frontmatter {
          title
          author
          templateKey
          date(fromNow: true)
          sdate: date(formatString: "YYYY-MM-DDTHHmmss")
          moddate(formatString: "YYYY-MM-DDTHHmmss")
          featuredimage {
            name
            base
            childImageSharp {
              original {
                height
                width
              }
            }
          }
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        description
        seoTitle
        seoDescription
      }
    }
  }
`;
