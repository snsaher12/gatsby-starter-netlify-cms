import { useStaticQuery, graphql } from "gatsby";
import React from "react";
import slugify from "github-slugger";

const slugger = new slugify();

export const FillSpace = (length, className = "index-column", max = 6) => {
  const space = [];
  for (var i = max; i > length; i--) {
    space.push(<div className={className} key={i}></div>);
  }
  return space;
};

export const FindCategory = (ID) => {
  const { categories } = FindItems();

  const category = categories.nodes.find((category) => category.frontmatter.id === ID);
  const categoryName = category?.frontmatter?.title;
  const categoryLink = category?.fields?.slug;

  return { categoryName, categoryLink };
};

export const FindAuthor = (ID) => {
  const { authors } = FindItems();

  const author = authors.nodes.find((author) => author.frontmatter.id === ID);
  const authorName = author?.frontmatter?.title;
  const authorLink = author?.fields?.slug;

  return { authorName, authorLink };
};

export const CreateID = (name) => {
  slugger.reset();
  return slugger.slug(name);
};

export const LinkFix = (item) => (item.link?.includes("/") ? item.link : `/${item.link}/`);

const FindItems = () => {
  const { authors, categories } = useStaticQuery(graphql`
    query Authors {
      authors: allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "author-page" } } }) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            id
            title
          }
        }
      }
      categories: allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "category-page" } } }) {
        nodes {
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
  `);

  return { authors, categories };
};

export const ReplaceTitle = (content, data) => {
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, key) => {
    const value = data[key];
    if (typeof value !== "undefined") {
      return value;
    }
    return match; // guards against some unintentional prefix
  });
};
