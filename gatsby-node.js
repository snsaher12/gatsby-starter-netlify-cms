const _ = require("lodash");
const path = require("path");
const { fmImagesToRelative } = require("gatsby-remark-relative-images");
const sharp = require(`sharp`);
const gihubSlugger = require("github-slugger");
const slugger = new gihubSlugger();

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return graphql(`
    {
      pages: allMarkdownRemark(filter: { frontmatter: { templateKey: { in: ["default-page", "index-page", "about-page"] } } }) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            templateKey
            title
          }
        }
      }
      categories: allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "category-page" } } }) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            id
          }
        }
      }
      categoriesCount: allMdx {
        group(field: frontmatter___category) {
          category: fieldValue
          totalCount
        }
      }
      authors: allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "author-page" } } }) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            id
          }
        }
      }
      authorsCount: allMdx {
        group(field: frontmatter___author) {
          author: fieldValue
          totalCount
        }
      }
      posts: allMdx {
        nodes {
          id
          rawBody
          body
          headings {
            value
            depth
          }
          fields {
            slug
          }
          frontmatter {
            title
            category
            beforebody
            afterbody
            featuredimage {
              base
              name
            }
            sidebar {
              image {
                base
                name
              }
            }
            products {
              name
              image {
                base
                name
              }
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()));
      return Promise.reject(result.errors);
    }

    const posts = result.data.posts.nodes;
    const pages = result.data.pages.nodes;
    const categories = result.data.categories.nodes;
    const categoriesCount = result.data.categoriesCount.group;
    const authors = result.data.authors.nodes;
    const authorsCount = result.data.authorsCount.group;

    const allImages = [];

    const createID = (name) => {
      slugger.reset();
      return slugger.slug(name);
    };

    const createImages = async (match, type, options, mobile = false) => {
      const name = match.split("/").filter(Boolean).pop();
      const lastDot = name.lastIndexOf(".");
      const fileName = name.substring(0, lastDot);
      const newPath = mobile ? `./static/image/${type}/${fileName}-m.webp` : `./static/image/${type}/${fileName}.webp`;
      if (!allImages.includes(newPath)) {
        allImages.push(newPath);
        const stream = sharp(match);
        await stream.resize(options).webp({ quality: 100 }).toFile(newPath);
      }
    };

    const createCategories = () => {
      categories.forEach((category) => {
        const id = category.id;
        const categoryID = category.frontmatter.id;
        const slug = category.fields.slug;
        const categoryCount = categoriesCount.find((categoryCount) => categoryCount.category === categoryID);
        const totalPosts = categoryCount && categoryCount.totalCount;
        const postsPerPage = 6;
        const numPages = totalPosts ? Math.ceil(totalPosts / postsPerPage) : 1;

        Array.from({ length: numPages }).forEach((_, i) => {
          createPage({
            path: i === 0 ? `${slug}/` : `${slug}/${i + 1}/`,
            component: path.resolve(`./src/templates/category-page.js`),
            context: {
              id,
              slug: slug,
              category: categoryID,
              limit: postsPerPage,
              skip: i * postsPerPage,
              numPages,
              currentPage: i + 1,
            },
          });
        });
      });
    };

    createCategories();

    const createAuthors = () => {
      authors.forEach((author) => {
        const id = author.id;
        const authorID = author.frontmatter.id;
        const slug = `/author${author.fields.slug}`;
        const authorCount = authorsCount.find((authorCount) => authorCount.author === authorID);
        const totalPosts = authorCount && authorCount.totalCount;
        const postsPerPage = 6;
        const numPages = totalPosts ? Math.ceil(totalPosts / postsPerPage) : 1;

        Array.from({ length: numPages }).forEach((_, i) => {
          createPage({
            path: i === 0 ? `${slug}/` : `${slug}/${i + 1}/`,
            component: path.resolve(`./src/templates/author-page.js`),
            context: {
              id,
              slug: slug,
              author: authorID,
              limit: postsPerPage,
              skip: i * postsPerPage,
              numPages,
              currentPage: i + 1,
            },
          });
        });
      });
    };

    createAuthors();

    const createPages = () => {
      pages.forEach((page) => {
        const id = page.id;
        const slug = page.fields.slug;
        const tempKey = page.frontmatter.templateKey;

        createPage({
          path: slug == "/index" ? "/" : `${slug}/`,
          component: path.resolve(`src/templates/${tempKey === "about-page" ? "default-page" : tempKey}.js`),
          // additional data can be passed via context
          context: {
            id,
          },
        });
      });
    };

    createPages();

    const createPosts = () => {
      posts.forEach((post) => {
        const id = post.id;
        const slug = post.fields.slug;
        try {
          const match = `./static/img/${post.frontmatter.featuredimage.base}`;
          createImages(match, "category", { width: 348 });
          createImages(match, "front-first", { width: 675 });
          createImages(match, "front-right", { width: 195 });
          createImages(match, "latest", { width: 385 });
          createImages(match, "post-first", { width: 868 });
          createImages(match, "post-first", { width: 450 }, true);
          createImages(match, "post-latest", { width: 230 });
        } catch (e) {
          throw `Featured Image not found for post ${slug}`;
        }

        const sidebar = post.frontmatter.sidebar;
        if (sidebar !== null && sidebar.image !== null) {
          const match = `./static/img/${sidebar.image.base}`;
          createImages(match, "sidebar", { width: 230, height: 150, fit: "inside" });
        }

        const products = post.frontmatter.products;
        if (products !== null) {
          products.map((item) => {
            if (item.image !== null) {
              const match = `./static/img/${item.image.base}`;
              const stream = sharp(match);
              const info = stream.metadata();
              if (info.width < 800) {
                createImages(match, "post", { width: info.width, fit: "inside" });
              } else {
                createImages(match, "post", { width: 800, fit: "inside" });
              }
              createImages(match, "table", { width: 110 });
              createImages(match, "table", { width: 220 }, true);
            }
          });
        }

        let m;
        let str1 = post.body;
        let str2 = post.frontmatter.afterbody;

        const tocData = [];
        const tocRex1 = /(mdx\(PTitle, ({[^}]*}))/g;
        const tocRex2 = /(title: "([^"]*)")/g;
        const tocRex3 = /(hlevel: "([^"]*)")/g;

        while ((m = tocRex1.exec(str1))) {
          let title;
          let heading;
          const newStr = m[2].split("\n").join("").split('"').join('"').split("  ").join("");
          while ((me = tocRex2.exec(newStr))) {
            title = me[2];
          }
          while ((me = tocRex3.exec(newStr))) {
            heading = me[2];
          }
          tocData.push({
            title,
            heading: heading || "2",
            id: title && createID(title),
          });
        }

        if (products !== null) {
          products.forEach((item) => {
            tocData.push({
              title: item.name,
              heading: "3",
              id: createID(item.name),
            });
          });
        }

        while ((m = tocRex1.exec(str2))) {
          let title;
          let heading;
          const newStr = m[2].split("\n").join("").split('"').join('"').split("  ").join("");
          while ((me = tocRex2.exec(newStr))) {
            title = me[2];
          }
          while ((me = tocRex3.exec(newStr))) {
            heading = me[2];
          }
          tocData.push({
            title,
            heading: heading || "2",
            id: title && createID(title),
          });
        }

        createPage({
          path: slug == "/index" ? "/" : `${slug}/`,
          component: path.resolve(`src/templates/blog-post.js`),
          // additional data can be passed via context
          context: {
            id,
            toc: tocData,
          },
        });
      });
    };

    createPosts(posts);
  });
};

exports.onCreateNode = ({ node }) => {
  fmImagesToRelative(node);
};

exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  createTypes(`
  type Mdx implements Node {
    frontmatter: MdxFrontmatter
    fields: MdxFields
  }

  type MdxFields {
    slug: String
  }

  type MdxFrontmatter @infer {
    templateKey: String
    featuredimage: File @fileByRelativePath
    beforebody: String @mdx
    afterbody: String @mdx
    products: [Product]
    sidebar: Sidebar
    faq: [Faq]
    table: ProductTable
    title: String
    btnText: String
    hidefeaturedimage: Boolean
    author: String
    category: String
    slug: String
    seoDescription: String
    seoTitle: String
    date(formatString: String, fromNow: Boolean): Date @dateformat
    moddate(formatString: String, fromNow: Boolean): Date @dateformat
    tableofcontent: Boolean
    rating: Boolean
    rcount: Int
    rvalue: Int
  }

  type Product @infer {
    name: String
    seoName: String
    btnText: String
    body: String @mdx
    image: File @fileByRelativePath
    link: String
    pros: [String]
    cons: [String]
    specs: [Spec]
  }

  type Sidebar @infer {
    stoc: [SidebarToC]
    stitle: String
    image: File @fileByRelativePath
    alink: String
    atext: String
  }

  type SidebarToC {
    level: Boolean
    name: String
  }
  
  type Spec {
    name: String
    value: String
  }

  type Faq {
    ques: String
    ans: String
  }

  type ProductTable {
    table: Boolean
    title: String
    headTitle: String
    seoTitle: String
    productColumns: [String]
  }

  type MarkdownRemark implements Node {
    frontmatter: MarkdownFrontmatter
  }

  type MarkdownFrontmatter @infer {
    templateKey: String
    id: String
    categories: [HomeCategory]
    title: String
    description: String
    seoTitle: String
    seoDescription: String
    image: File @fileByRelativePath
    schema: String
    cookies: Cookies
    disqus: String
    facebook: String
    twitter: String
    youtube: String
    number: String
    topNav: [Nav]
    colors: Colors
    ads: Ads
    footerNav: [CategoryLink]
    logoSmall: File! @fileByRelativePath
    logoLarge: File! @fileByRelativePath
    faviconSmall: File! @fileByRelativePath
    faviconLarge: File! @fileByRelativePath
    linkType: Boolean
  }

  type HomeCategory {
    title: String
    links: [CategoryLink]
  }

  type Cookies {
    enabled: Boolean
    message: String
  }

  type CategoryLink {
    title: String
    link: String
  }

  type Nav {
    title: String
    link: String
    child: [Nav]
  }

  type Colors @infer {
    headerTextColor: String
  }

  type Ads @infer {
    enableAds: Boolean
    disabledPostsAds: [String]
    adCodes: AdCodes
  }

  type AdCodes @infer {
    afterToC: String 
    afterTitle: String 
    insideBody: String 
    sidebarSticky: String
    beforeAuthor: String
    stickyMobile: String
  }
`);
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage.startsWith("develop")) {
    actions.setWebpackConfig({
      resolve: {
        alias: {
          "react-dom": "@hot-loader/react-dom",
        },
      },
    });
  }
};
