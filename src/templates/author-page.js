import React from "react";
import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import HeadData from "../components/HeadData.js";
import SiteMetaData from "../components/SiteMetadata.js";
import { FindCategory, FillSpace } from "../components/SimpleFunctions.js";

const AuthorPage = (props) => {
  const { title: siteName } = SiteMetaData();
  const { data } = props;
  const { markdownRemark: post } = data;
  const { title, description, seoTitle, seoDescription } = post.frontmatter;
  const { base: img } = post.frontmatter.image;
  const { width, height } = post.frontmatter.image.childImageSharp.original;

  return (
    <Layout>
      <HeadData title={`${seoTitle} - ${siteName}`} description={seoDescription} />
      <section className="section author-page">
        <div className="container">
          <div className="author-top">
            <div className="content">
              <div className="author">
                <p>
                  <img src={`/img/${img}`} alt={title} loading="lazy" width={width} height={height} />
                </p>
                <div className="author_desc">
                  <h1 className="author_title">{title}</h1>
                  <p>{description}</p>
                </div>
              </div>
            </div>
          </div>
          <AuthorPosts {...props} posts={data.allMdx.edges} />
        </div>
      </section>
    </Layout>
  );
};

AuthorPage.propTypes = {
  data: PropTypes.object.isRequired,
};

const AuthorPosts = (props) => {
  const { posts } = props;
  const { currentPage, numPages } = props.pageContext;
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1 ? `${props.pageContext.slug}/` : `${props.pageContext.slug}/${currentPage - 1}/`;
  const nextPage = `${props.pageContext.slug}/${currentPage + 1}/`;

  return (
    <div className="latest-posts">
      <p className="lp-title">Author Posts</p>
      <div className="category-bottom-section">
        <div className="category-columns">
          {posts &&
            posts.map(({ node: post }) => {
              const { category, title, date } = post.frontmatter;
              const { name: imgName, base: img } = post.frontmatter.featuredimage;
              const { width, height } = post.frontmatter.featuredimage.childImageSharp.original;
              const slug = post.fields.slug;
              const id = post.id;
              const { categoryName, categoryLink } = FindCategory(category);

              return (
                <div className="category-column" key={id}>
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
                      {categoryName && (
                        <>
                          <Link to={`${categoryLink}/`}>{categoryName}</Link> |{" "}
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
  );
};

export default AuthorPage;

export const authorPageQuery = graphql`
  query AuthorPageByID($id: String!, $author: String!, $skip: Int!, $limit: Int!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        seoTitle
        seoDescription
        description
        image {
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
    allMdx(sort: { order: DESC, fields: [frontmatter___date] }, filter: { frontmatter: { author: { eq: $author } } }, limit: $limit, skip: $skip) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            category
            date(fromNow: true)
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
    }
  }
`;
