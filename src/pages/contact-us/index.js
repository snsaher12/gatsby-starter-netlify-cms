import React, { useState } from "react";
import { navigate } from "gatsby-link";
import Layout from "../../components/Layout";
import HeadData from "../../components/HeadData.js";
import SiteMetaData from "../../components/SiteMetadata";

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

const ContactUs = () => {
  const [state, setState] = useState({ isValidated: false });
  const { title: siteName, siteURL, logoLarge } = SiteMetaData();

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": form.getAttribute("name"),
        ...state,
      }),
    })
      .then(() => navigate(form.getAttribute("action")))
      .catch((error) => alert(error));
  };

  const title = `Contact Us - ${siteName}`;
  const description = "Feel free to contact us anytime or about anything, we are due with your debate. Our support team is always ready to help our audience, and whosoever.";
  const schema = `{
    "@context":"https://schema.org",
    "@type":"ContactPage",
    "mainEntityOfPage":{
      "@type":"WebPage",
      "@id":"${siteURL}/contact-us/"
    },
    "url":"${siteURL}/contact-us/",
    "headline":"${title}",
    "description":"${description}",
    "image":{
      "@type":"ImageObject",
      "@id":"${siteURL}/contact-us/#primaryimage",
      "url":"${siteURL}/useful-img/Best-Gaming-PC-Build.jpg",
      "width":"1836",
      "height":"1948"
    },
    "publisher": {
      "@type":"Organization",
      "name":"${siteName}",
      "logo":{
        "@type":"ImageObject",
        "url":"${siteURL}/img/${logoLarge.base}",
        "width":"800",
        "height":"258"
      }
    }
  }`;

  return (
    <Layout title={title}>
      <section className="section default-page">
        <HeadData title={title} description={description} schema={schema} />
        <div className="container">
          <div className="content">
            <h1 className="title">{title}</h1>
            <form name="contact" method="post" action="/contact-us/thanks/" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={handleSubmit} className="contactform">
              {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
              <input type="hidden" name="form-name" value="contact" />
              <div hidden>
                <label>
                  Don’t fill this out: <input name="bot-field" onChange={handleChange} />
                </label>
              </div>
              <div className="field">
                <label className="label" htmlFor={"name"}>
                  <strong>Your Name (required)</strong>
                </label>
                <div className="control">
                  <input className="input form-control" type={"text"} name={"name"} onChange={handleChange} id={"name"} required={true} />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor={"email"}>
                  <strong>Your Email (required)</strong>
                </label>
                <div className="control">
                  <input className="input form-control" type={"email"} name={"email"} onChange={handleChange} id={"email"} required={true} />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor={"subject"}>
                  <strong>Subject</strong>
                </label>
                <div className="control">
                  <input className="input form-control" type={"text"} name={"subject"} onChange={handleChange} id={"subject"} />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor={"message"}>
                  <strong>Your Message (required)</strong>
                </label>
                <div className="control">
                  <textarea className="textarea form-control" name={"message"} onChange={handleChange} id={"message"} required={true} />
                </div>
              </div>
              <div className="field">
                <button className="button is-link" type="submit">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactUs;
