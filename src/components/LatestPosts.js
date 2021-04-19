import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { FillSpace, FindCategory } from "../components/SimpleFunctions.js";

const LatestPosts = () => {
  const lp = useStaticQuery(graphql`
    {
      allMdx(sort: { order: DESC, fields: [frontmatter___date] }, limit: 3) {
        nodes {
          id
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
    }
  `);

  const { nodes: posts } = lp.allMdx;

  return (
    <div className="category-section latest-posts">
      <p className="lp-title">Latest Posts</p>
      <div className="index-columns">
        {posts.map((post) => {
          const id = post.id;
          const slug = post.fields.slug;
          const { title, category } = post.frontmatter;
          const { name: imgName, base: img } = post.frontmatter.featuredimage;
          const { width, height } = post.frontmatter.featuredimage.childImageSharp.original;
          const { categoryName, categoryLink } = FindCategory(category);

          return (
            <div className="index-column" key={id}>
              <div className="index-col-image">
                <Link to={`${slug}/`}>
                  <picture>
                    <source srcSet={`/image/latest/${imgName}.webp`} />
                    <img src={`/img/${img}`} alt={title} loading="lazy" width={width} height={height} />
                  </picture>
                </Link>
              </div>
              {categoryLink && (
                <div className="index-box-category">
                  <Link to={`${categoryLink}/`}>{categoryName}</Link>
                </div>
              )}
              <div className="index-box-title">
                <Link to={`${slug}/`}>{title}</Link>
              </div>
            </div>
          );
        })}
        {FillSpace(posts.length, "index-column", 3)}
      </div>
    </div>
  );
};

export default LatestPosts;
