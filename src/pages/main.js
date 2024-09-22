import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import searchIcon from '../img/search.svg';
import profileIcon from '../img/profile.svg';
import homeIcon from '../img/home.svg';
import addIcon from '../img/add.svg';
import exploreIcon from '../img/explore.svg';

const CoLab = () => {
  const [cookies] = useCookies(['user']);
  const [username, setUsername] = useState('');
  const [isFooterVisible, setFooterVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [error, setError] = useState(null);
  const [loadingTiles, setLoadingTiles] = useState(true);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  };

  const handleHomeClick = () => {
    navigate('/main');
  };

  const handleAddClick = () => {
    navigate('/add');
  };

  const handleExploreClick = () => {
    navigate('/explore');
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  useEffect(() => {
    const userCookie = cookies.user;
    if (userCookie) {
      setUsername(userCookie);
    }

    const fetchTiles = async () => {
      setLoadingTiles(true);
      try {
        const response = await axios.get(`http://localhost:5000/tiles`);
        setTiles(response.data);
      } catch (error) {
        console.error('Error fetching tiles:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoadingTiles(false);
      }
    };
    
    fetchTiles();

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setFooterVisible(false);
      } else {
        setFooterVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cookies, lastScrollY, username]);

  return (
    <div className="maina">
      <header>
        <button className="icon" onClick={handleSearchClick}>
          <img src={searchIcon} alt="Search" width="30" height="30" />
        </button>
        <h2 className="co">Co-lab</h2>
        <button className="icon" onClick={handleProfileClick}>
          <img src={profileIcon} alt="Profile" width="30" height="30" />
        </button>
      </header>

      <div className="contenta">
        {loadingTiles ? (
          <div className="tile">Loading posts...</div>
        ) : error ? (
          <div className="tile">{error}</div>
        ) : tiles.length > 0 ? (
          tiles.map((tile) => (
            <div className="tile" key={tile.id}>
              <div className="tile-content">
                <div className="t-c">{tile.content}</div>
                <div className="tag">{tile.tags}</div>
              </div>
              <div className="detail">
                <div className="user" onClick={() => handleProfileClick(tile.username)}> @{tile.username}</div>
                <div className="date">{new Date(tile.date_posted).toLocaleDateString()}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="tile">No posts available.</div>
        )}
      </div>

      {isFooterVisible && (
        <footer className="footer">
          <button className="icon" onClick={handleHomeClick}>
            <img src={homeIcon} alt="Home" width="30" height="30" />
          </button>
          <button className="icon" onClick={handleAddClick}>
            <img src={addIcon} alt="Add" width="30" height="30" />
          </button>
          <button className="icon" onClick={handleExploreClick}>
            <img src={exploreIcon} alt="Explore" width="30" height="30" />
          </button>
        </footer>
      )}
    </div>
  );
};

export default CoLab;
