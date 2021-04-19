import React, { useState } from "react";
import { Link, graphql, useStaticQuery } from "gatsby";
import * as JsSearch from "js-search";

const App = () => {
  const data = useStaticQuery(graphql`
    {
      allMdx {
        nodes {
          id
          frontmatter {
            title
            slug
            seoDescription
          }
        }
      }
    }
  `);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const search = new JsSearch.Search("id");
  search.addIndex(["frontmatter", "title"]);
  search.addIndex(["frontmatter", "slug"]);
  search.addIndex(["frontmatter", "seoDescription"]);
  search.addDocuments(data.allMdx.nodes);

  const changeValue = (e) => {
    setSearchValue(e.target.value);
    setSearchResults(search.search(e.target.value));
  };

  return (
    <div className="instant-search">
      <form noValidate className="ais-SearchBox-form" role="search">
        <input type="search" placeholder="Search here…" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required="" maxLength="512" className="ais-SearchBox-input" onChange={changeValue} value={searchValue} />
      </form>
      <Results value={searchValue} results={searchResults} />
    </div>
  );
};

const Results = ({ results, value }) => {
  const result = value && results.slice(0, 7).map((item, index) => <Hit key={index} hit={item.frontmatter} />);

  return result ? (
    <div className="search-results">
      <p className="result-title">{result.length !== 0 ? "Results" : "No Results Found!"}</p>
      <div className="search-results-inner">{result}</div>
    </div>
  ) : null;
};

function Hit({ hit }) {
  return (
    <div className="result-name">
      <Link to={`/${hit.slug}/`}>
        <p>{hit.title}</p>
      </Link>
    </div>
  );
}

export default App;
