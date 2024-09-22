import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './index.css';
import searchIcon from '../img/search.svg';
import profileIcon from '../img/profile.svg';
import homeIcon from '../img/home.svg';
import addIcon from '../img/add.svg';
import exploreIcon from '../img/explore.svg';

const Header = () => {
    const navigate = useNavigate();
    const username = useCookies(['user'])[0].user; // Get username from cookies

    return (
        <header className='headeri'>
            <button className="icon" onClick={() => navigate('/search')} >
                <img src={searchIcon} alt="Search" width="30" height="30" />
            </button>
            <h2 className="co">Co-lab</h2>
            <button className="icon"  onClick={() => navigate(`/profile/${username}`)}>
                <img src={profileIcon} alt="Profile" width="30" height="30" />
            </button>
        </header>
    );
};

// Footer component
const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <button className="icon" onClick={() => navigate('/main')}>
                <img src={homeIcon} alt="Home" width="30" height="30" />
            </button>
            <button className="icon" onClick={() => navigate('/add')}>
                <img src={addIcon} alt="Add" width="30" height="30" />
            </button>
            <button className="icon" onClick={() => navigate('/explore')}>
                <img src={exploreIcon} alt="Explore" width="30" height="30" />
            </button>
        </footer>
    );
};


const Search = () => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tags');
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleSearch = async () => {
    if (selectedTag) {
      try {
        const response = await axios.get(`http://localhost:5000/tiles/tag/${selectedTag}`); // Updated endpoint
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };
  

  return (
    <div className='bodyx'>
      <div className="search-containeri">
      <Header />
        

        <h2 className="retro-titlei">Tag Search</h2>
        <div className="dropdown-containeri">
          <select 
            className="retro-dropdowni" 
            value={selectedTag} 
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">Select a tag</option>
            {tags.map((tag) => (
              <option key={tag.name} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
          <button className="retro-buttoni" onClick={handleSearch}>Search</button>
        </div>

        <div className="results-containeri">
          <h3 className="results-titlei"></h3>
          <div className="results-boxi">
  {results.length > 0 ? (
    results.map((result) => (
      <div className="tilei" key={result.id}>
        <div className="tile-content">
          <div className="t-c">{result.content}</div>
          {result.tags && <div className="tag">{result.tags}</div>}
        </div>
        <div className="detail">
          <div className="user">Posted by @<br/>{result.username}</div>
          <div className="date">{new Date(result.date_posted).toLocaleDateString()}</div>
        </div>
      </div>
    ))
  ) : (
    <div className="tile">No results found.</div>
  )}
</div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
