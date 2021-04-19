import React from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";
import HeadData from "../components/HeadData.js";
import { Calendar } from "../components/SVG.js";
import SiteMetaData from "../components/SiteMetadata.js";
import { FindCategory, FillSpace, LinkFix } from "../components/SimpleFunctions.js";

const IndexTemplate = ({ data }) => {
  const singlePost = data.FP.nodes[0];
  const otherPosts = data.OP.nodes;
  const allPosts = data.posts.nodes;
  const sections = data.allMarkdownRemark.categories
    .map((category) => {
      const posts = allPosts.filter((post) => post.frontmatter.category === category.frontmatter.id).slice(0, 6);
      return { title: category.frontmatter.title, posts };
    })
    .filter((category) => category.posts.length);
  const { seoTitle: title, seoDescription: description } = data.markdownRemark.frontmatter;
  const { siteURL, title: siteName, number, facebook, youtube, twitter, logoLarge } = SiteMetaData();
  const homeCategories = data.markdownRemark.frontmatter.categories;

  const websiteSchema = `{
      "@context":"https://schema.org",
      "@type":"WebSite",
      "@id":"${siteURL}/#website",
      "headline":"${title}",
      "name":"${siteName}",
      "description":"${description}",
      "url":"${siteURL}",
      "potentialAction":{
        "@type":"SearchAction",
        "target":"${siteURL}/?s={search_term_string}",
        "query-input":"required name=search_term_string"
      }
    }`;

  const newsMediaSchema = `{
        "@context":"https://schema.org",
        "@type":"NewsMediaOrganization",
        "@id":"${siteURL}/#Organization",
        "name":"${siteName}",
        "url":"${siteURL}",
        "sameAs":[
          "${facebook}",
          "${youtube}",
          "${twitter}"
        ],
        "logo":{
          "@type":"ImageObject",
          "url":"${siteURL}/img/${logoLarge.base}",
          "width":"800",
          "height":"258"
        },
        "contactPoint":{
          "@type":"ContactPoint",
          "contactType":"customer support",
          "telephone":"${number}",
          "url":"${siteURL}/contact-us/"
        }
    }`;

  return (
    <Layout>
      <section className="section index">
        <HeadData title={title} description={description} schema={`[${websiteSchema}, ${newsMediaSchema}]`} />
        <div className="container content">
          <div className="index-latest-title">
            <h2>Latest Posts</h2>
          </div>
          <div className="index-top-section">
            {singlePost && <FirstPost post={singlePost} />}
            <OtherPosts posts={otherPosts} />
          </div>
          <div className="index-bottom-section">
            <Sections sections={sections} />
            {!!homeCategories.length && (
              <div className="index-categories">
                <div className="index-latest-title">
                  <h2>Categories</h2>
                </div>
                <div className="index-inner-categories">
                  {homeCategories.map((item, index) => (
                    <div className="index-category" key={index}>
                      <h2>{item.title}</h2>
                      <div className="category-links">
                        {item.links?.map((item, index) => (
                          <div className="category-link" key={index}>
                            <Link to={LinkFix(item)}>{item.title}</Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

IndexTemplate.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

const FirstPost = ({ post }) => {
  const { title, category, date } = post.frontmatter;
  const { name: imgName, base: img } = post.frontmatter.featuredimage;
  const { width, height } = post.frontmatter.featuredimage.childImageSharp.original;
  const slug = post.fields.slug;
  const { categoryName, categoryLink } = FindCategory(category);

  return (
    <div className="first-post">
      <div className="first-post-thumbnail">
        <Link to={`${slug}/`}>
          <picture>
            <source media="(min-width:768px)" srcSet={`/image/front-first/${imgName}.webp`} />
            <source media="(min-width:100px)" srcSet={`/image/post-first/${imgName}-m.webp`} />
            <img src={`/img/${img}`} alt={title} loading="lazy" width={width} height={height} />
          </picture>
        </Link>
      </div>
      <div className="first-post-info">
        <div className="post-info-category">
          <Link to={`${categoryLink}/`}>{categoryName}</Link>
        </div>
        <div className="post-info-title">
          <Link to={`${slug}/`}>{title}</Link>
        </div>
        <div className="post-info-date">
          <Calendar />
          {date}
        </div>
      </div>
    </div>
  );
};

const OtherPosts = ({ posts }) => (
  <div className="other-posts">
    {posts.map((post, index) => {
      const { title, category } = post.frontmatter;
      const { name: imgName, base: img } = post.frontmatter.featuredimage;
      const { width, height } = post.frontmatter.featuredimage.childImageSharp.original;
      const slug = post.fields.slug;
      const { categoryName, categoryLink } = FindCategory(category);

      return (
        <div className="other-post" key={index}>
          <div className="other-post-thumbnail">
            <Link to={`${slug}/`}>
              <picture>
                <source srcSet={`/image/front-right/${imgName}.webp`} />
                <img src={`/img/${img}`} alt={title} loading="lazy" width={width} height={height} />
              </picture>
            </Link>
          </div>
          <div className="other-post-info">
            <div className="post-info-category">
              <Link to={`${categoryLink}/`}>{categoryName}</Link>
            </div>
            <div className="post-info-title">
              <Link to={`${slug}/`}>{title}</Link>
            </div>
            <div className="post-info-date">{post.frontmatter.date}</div>
          </div>
        </div>
      );
    })}
  </div>
);

const Sections = ({ sections }) => {
  return (
    <div className="category-sections">
      {sections.map((category, index) => (
        <div className="category-section" key={index}>
          <div className="index-latest-title">
            <h2>{category.title}</h2>
          </div>
          <div className="index-columns">
            {category.posts.map((post, index) => {
              const { title } = post.frontmatter;
              const { name: imgName, base: img } = post.frontmatter.featuredimage;
              const { width, height } = post.frontmatter.featuredimage.childImageSharp.original;
              const slug = post.fields.slug;

              return (
                <div className="index-column" key={index}>
                  <div className="index-col-image">
                    <Link to={`${slug}/`}>
                      <picture>
                        <source srcSet={`/image/latest/${imgName}.webp`} />
                        <img src={`/img/${img}`} alt={title} loading="lazy" width={width} height={height} />
                      </picture>
                    </Link>
                  </div>
                  <div className="index-box-title">
                    <Link to={`${slug}/`}>{title}</Link>
                  </div>
                </div>
              );
            })}
            {FillSpace(category.posts.length)}
          </div>
        </div>
      ))}
    </div>
  );
};

export const IndexQuery = graphql`
  query IndexQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        seoTitle
        seoDescription
        categories {
          title
          links {
            title
            link
          }
        }
      }
    }
    FP: allMdx(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date(fromNow: true)
          category
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
    OP: allMdx(sort: { order: DESC, fields: [frontmatter___date] }, limit: 3, skip: 1) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date(fromNow: true)
          category
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
    posts: allMdx(sort: { order: DESC, fields: [frontmatter___date] }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          category
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
    allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "category-page" } } }) {
      categories: nodes {
        fields {
          slug
        }
        frontmatter {
          id
          title
        }
      }
    }
  }
`;

export default IndexTemplate;
