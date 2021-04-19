import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import BlogInfo from "../components/blog/BlogInfo.js";
import HeadData from "../components/HeadData.js";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import * as PostComps from "../components/blog/PostComponents.js";
import Author from "../components/Author.js";
import LatestPosts from "../components/LatestPosts.js";
import RatingBox from "../components/blog/RatingBox";
import { TopArrow } from "../components/SVG.js";
import { DiscussionEmbed } from "disqus-react";
import LazyLoad from "react-lazy-load";
import SiteMetaData from "../components/SiteMetadata.js";
import SidebarLatestPosts from "../components/sidebar/SidebarLatestPosts";
import SidebarTableofContents from "../components/sidebar/SidebarTableofContents";
import Search from "../components/SearchForm";
import { FindCategory, CreateID } from "../components/SimpleFunctions.js";

export const BlogPostTemplate = (props) => {
  const { frontmatter, link, tocdata, body } = props;
  const { title: siteName, ads, disqus } = SiteMetaData();
  const adCodes = ads?.adCodes;
  const [btT, setBtT] = useState("");
  const contentRef = useRef(null);
  const [topOffset, setTopOffset] = useState(900000000);
  const { base: img, name: imgName, childImageSharp } = frontmatter.featuredimage;
  const { width, height } = childImageSharp.original;
  const disqusConfig = {
    url: link,
    title: frontmatter.title,
  };
  const showAds = ads?.enableAds && !ads?.disabledPostsAds?.includes(frontmatter.slug);

  const scrollTop = () => {
    typeof window !== "undefined" &&
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  };

  const backToTop = () => {
    window.scrollY > 300 ? setBtT("active") : setBtT("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", backToTop);

      setTopOffset(contentRef.current.offsetTop + contentRef.current.offsetHeight - 1000);

      return () => window.removeEventListener("scroll", backToTop);
    }
  }, [frontmatter.tableofcontent]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ea = document.querySelectorAll("a[href^='#']");
      const r = (e) => {
        e.preventDefault();
        const o = e.target.getAttribute("href").substring(1);
        if (document.getElementById(o)) {
          const e = window.scrollY + document.getElementById(o).getBoundingClientRect().top - 20;
          window.scrollTo({ top: e, behavior: "smooth" });
        }
      };
      for (const t of ea) {
        t.addEventListener("click", r);
      }
      return () => {
        for (const t of ea) {
          t.removeEventListener("click", r);
        }
      };
    }
  }, []);

  return (
    <>
      <section className="section blog-post">
        <button onClick={() => scrollTop()} className={`btp ${btT}`}>
          <TopArrow />
        </button>
        <div className="container content">
          <div className="blog-columns">
            <div className="column is-9">
              <div className="blog-section-top">
                {!frontmatter.hidefeaturedimage && (
                  <picture className="blog-top-img">
                    <source media="(min-width:768px)" srcSet={`/image/post-first/${imgName}.webp`} />
                    <source media="(min-width:100px)" srcSet={`/image/post-first/${imgName}-m.webp`} />
                    <img src={`/img/${img}`} alt={frontmatter.title} loading="lazy" width={width} height={height} />
                  </picture>
                )}
                <div className="blog-section-top-inner">
                  <h1 className="title">{frontmatter.title}</h1>
                  <BlogInfo date={frontmatter.date} disqusConfig={disqusConfig} disqus={disqus} title={frontmatter.title} image={img} />
                  <MDXProvider components={PostComps}>
                    <MDXRenderer>{frontmatter.beforebody}</MDXRenderer>
                  </MDXProvider>
                </div>
              </div>
              {frontmatter.tableofcontent && !!tocdata.length && <PostComps.TableOfContents data={tocdata} />}
              {showAds && <div className="ads-toc" dangerouslySetInnerHTML={{ __html: adCodes?.afterToC }} />}
              {frontmatter.table?.table && frontmatter.table?.title && !!frontmatter.products?.length && <PostComps.PTitle title={frontmatter.table?.title} cName="is-bold is-center" />}
              {frontmatter.table?.table && !!frontmatter.products?.length && <PostComps.ProductsTable products={frontmatter.products} headTitle={frontmatter.table?.headTitle} productColumns={frontmatter.table.productColumns} title={frontmatter.table?.seoTitle} />}
              <div ref={contentRef} className="post-content">
                <MDXProvider components={PostComps}>
                  <MDXRenderer>{body}</MDXRenderer>
                </MDXProvider>
                {!!frontmatter.products?.length && (
                  <div className="products">
                    {frontmatter.products?.map((item, index) => (
                      <div className="product-box" key={index}>
                        <PostComps.PTitle hlevel="3" title={item.name} />
                        {item.image && <PostComps.PImage alt={item.name} src={item.image.base} link={item.link} />}
                        {!!item.specs?.length && <PostComps.SpecTable spec={item.specs} />}
                        <MDXProvider components={PostComps}>
                          <MDXRenderer>{item.body}</MDXRenderer>
                        </MDXProvider>
                        {(!!item.pros?.length || !!item.cons?.length) && <PostComps.ProsNCons pros={item.pros} cons={item.cons} />}
                        <PostComps.BButton link={item.link} title={item.btnText} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="blog-section-bottom">
                <MDXProvider components={PostComps}>
                  <MDXRenderer>{frontmatter.afterbody}</MDXRenderer>
                </MDXProvider>
              </div>
              {!!frontmatter.faq?.length && (
                <div className="post-faq">
                  <h2 className="faq-title">Frequently Asked Questions</h2>
                  {frontmatter.faq.map((item, index) => (
                    <div className="faq-question" key={index}>
                      <h3 className="faq-ques">{item.ques}</h3>
                      <p className="faq-ans">{item.ans}</p>
                    </div>
                  ))}
                </div>
              )}
              {frontmatter.rating && <RatingBox count={frontmatter.rcount} value={frontmatter.rvalue} />}
              {showAds && <div className="ads-author" dangerouslySetInnerHTML={{ __html: adCodes?.beforeAuthor }} />}
              <Author authorID={frontmatter.author} />
              {disqus && (
                <div id="disqus_thread">
                  <LazyLoad offsetTop={topOffset}>
                    <DiscussionEmbed config={disqusConfig} shortname={disqus} />
                  </LazyLoad>
                </div>
              )}
            </div>
            <div className="column is-3">
              <div className="sidebar">
                <div className="site-info">
                  <p>{siteName} is reader-supported. When you buy through links on our site, we may earn an affiliate commission.</p>
                </div>
                <Search />
                <SidebarLatestPosts />
                <SidebarTableofContents data={frontmatter.sidebar} ad={showAds && <div className="ads-sidebar" dangerouslySetInnerHTML={{ __html: adCodes?.sidebarSticky }} />} />
              </div>
            </div>
          </div>
          <LatestPosts />
        </div>
      </section>
      {showAds && <div className="ads-mobile" dangerouslySetInnerHTML={{ __html: adCodes?.stickyMobile }} />}
    </>
  );
};

const BlogPost = (props) => {
  const { siteURL, title: siteName, logoLarge } = SiteMetaData();
  const { mdx: post } = props.data;
  const { frontmatter } = post;
  const { base: img } = frontmatter.featuredimage;
  const path = `${siteURL}/${frontmatter.slug}/`;
  const { categoryName, categoryLink } = FindCategory(frontmatter.category);

  const articleSchema = `{
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${path}"
    },
    "headline": "${frontmatter.title}",
    "image": [
      "${siteURL}/img/${img}"
     ],
    "datePublished": "${frontmatter.sdate}",
    "dateModified": "${frontmatter.moddate}",
    "author": {
      "@type": "Person",
      "name": "${frontmatter.author}"
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

  const ratingSchema = `{
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "${frontmatter.title}",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "${frontmatter.rvalue.toString()}",
      "ratingCount": "${frontmatter.rcount.toString()}",
      "bestRating": "5",
      "worstRating": "1"
    }
  }`;

  const faqSchema = `{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      ${frontmatter.faq?.map(
        (item) => `{
          "@type": "Question",
          "name": "${item.ques}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "${item.ans}" 
          }
        }`
      )}
    ]
  }`;

  const productSchema = `{
    "@context": "http://schema.org",
    "@type": "ItemList",
    "url": "${path}",
    "name": "${frontmatter.title}",
    "itemListElement": [
      ${frontmatter.products?.map(
        (item, index) => `{
        "@type":"ListItem",
        "position":${index + 1},
        "url":"${path}#${CreateID(item.name)}",
        "@id":"#${CreateID(item.name)}",
        "name":"${item.name}"
      }`
      )}
    ]
  }`;

  return (
    <Layout type="post" title={frontmatter.title} titleParent={categoryName} link={`${categoryLink}/`}>
      <HeadData title={frontmatter.seoTitle} description={frontmatter.seoDescription} image={img}>
        {frontmatter.author && <script type="application/ld+json">{articleSchema}</script>}
        {frontmatter.rating && <script type="application/ld+json">{ratingSchema}</script>}
        {frontmatter.products?.length && <script type="application/ld+json">{productSchema}</script>}
        {frontmatter.faq?.length && <script type="application/ld+json">{faqSchema}</script>}
      </HeadData>
      <BlogPostTemplate body={post.body} frontmatter={frontmatter} link={path} tocdata={props.pageContext.toc} headings={post.headings} />
    </Layout>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.object,
  }),
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        slug
        seoTitle
        seoDescription
        featuredimage {
          base
          name
          childImageSharp {
            original {
              height
              width
            }
          }
        }
        hidefeaturedimage
        date(fromNow: true)
        sdate: date(formatString: "YYYY-MM-DDTHHmmss")
        moddate(formatString: "YYYY-MM-DDTHHmmss")
        tableofcontent
        author
        rating
        rcount
        rvalue
        beforebody
        table {
          table
          title
          headTitle
          seoTitle
          productColumns
        }
        products {
          name
          seoName
          link
          image {
            name
            base
            childImageSharp {
              original {
                height
                width
              }
            }
          }
          body
          pros
          cons
          specs {
            name
            value
          }
          btnText
        }
        afterbody
        category
        sidebar {
          stitle
          atext
          alink
          stoc {
            level
            name
          }
          image {
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
        faq {
          ans
          ques
        }
      }
    }
  }
`;
