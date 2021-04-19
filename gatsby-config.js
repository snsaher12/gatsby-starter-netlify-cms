const path = require("path");
require("dotenv").config();

module.exports = {
  siteMetadata: {
    siteURL: process.env.URL,
    siteUrl: process.env.URL,
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/img`,
        name: "uploads",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/posts`,
        name: "posts",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-relative-images",
            options: {
              name: "uploads",
            },
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              destinationDir: "static",
            },
          },
          {
            resolve: `gatsby-remark-images-native-lazy-load`,
            options: {
              loading: "lazy", // "lazy" | "eager" | "auto"
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [{ resolve: `gatsby-remark-auto-headers`, options: { icon: false, elements: [`h2`, `h3`, `h4`] } }],
      },
    },
    {
      resolve: "gatsby-plugin-mdx-frontmatter",
    },
    "gatsby-plugin-slug",
    `gatsby-plugin-remove-fingerprints`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: [`/contact-us/thanks`],
      },
    },
    "gatsby-plugin-robots-txt",
    {
      resolve: "gatsby-plugin-netlify-cms",
      options: {
        manualInit: true,
        modulePath: `${__dirname}/src/cms/cms.js`,
        customizeWebpackConfig: (config, { plugins }) => ((config.node.fs = "empty"), (config.node.child_process = "empty"), config.plugins.push(plugins.define({ "process.env.MY_BRANCH": JSON.stringify(process.env.BRANCH) }))),
      },
    },
    {
      resolve: "gatsby-plugin-purgecss", // purges all unused/unreferenced css rules
      options: {
        content: [path.join(process.cwd(), "src/**/!(*.d).{js,mdx,md}")],
        develop: true, // Activates purging in npm run develop
        purgeOnly: ["css/"], // applies purging only on the bulma css file
      },
    }, // must be after other CSS plugins
    // make sure to keep it last in the array
  ],
};
