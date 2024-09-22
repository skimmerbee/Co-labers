import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import searchIcon from '../img/search.svg';
import profileIcon from '../img/profile.svg';
import homeIcon from '../img/home.svg';
import addIcon from '../img/add.svg';
import exploreIcon from '../img/explore.svg';

const UserProfile = ({ loggedInUsername }) => {
  const [cookies] = useCookies(['user']);
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [loadingTiles, setLoadingTiles] = useState(true);
  const [error, setError] = useState(null);
  const [isFooterVisible, setFooterVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  };

  const handleEditProfile = () => {
    navigate(`/edit-profile/${username}`);
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${username}`);
        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data; // Parse if it's a string
    
        // Parse contact_info if it's a string
        if (data.contact_info && typeof data.contact_info === 'string') {
          data.contact_info = JSON.parse(data.contact_info);
        }
    
        // Parse tags if it's a string
        if (data.tags && typeof data.tags === 'string') {
          data.tags = data.tags.split(','); // Convert to array
        }
    
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again later.');
    
        // Optional: Handle specific status codes
        if (error.response && error.response.status === 404) {
          setError('Profile not found.');
        }
      }
    };
    
    
    const fetchTiles = async (username) => {
      if (username) {
        setLoadingTiles(true);
        try {
          const response = await axios.get(`http://localhost:5000/tiles/user/${username}`); // Updated endpoint
          console.log('Tiles data:', response.data);
          setTiles(response.data);
        } catch (error) {
          console.error('Error fetching tiles:', error);
          setError('Failed to load posts. Please try again later.');
        } finally {
          setLoadingTiles(false);
        }
      }
    };
    
    

    fetchProfile();
    fetchTiles(username);

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
  }, [username, lastScrollY]);

  return (
    <div className="maina">
      {/* Header */}
      <header>
        <button className="icon" onClick={() => navigate('/search')} >
          <img src={searchIcon} alt="Search" width="30" height="30" />
        </button>
        <h2 className="co">Co-lab</h2>
        <button className="icon" onClick={handleProfileClick}>
          <img src={profileIcon} alt="Profile" width="30" height="30" />
        </button>
      </header>

      {/* User Profile Section */}
      {profile && (
        <div className="usercard">
          <div className="cardwrite">
            <h1>{profile.username}</h1>
          </div>
          <div className="cardmain">
            <p className="cardmainw">About: {profile.bio || 'No bio available.'}</p>
            <p className="cardmainw">Skills: {profile.tags ? profile.tags.join(', ') : 'No skills listed.'}</p>
            <p className="cardmainw">Location: {profile.location || 'Location not specified.'}</p>
            <p className="cardmainw">Contact :</p>
            
<div>
  <p className="cardmainw">
    {profile.contact_info && Object.keys(profile.contact_info).length > 0 ? (
      Object.entries(profile.contact_info).map(([key, value]) => (
        value ? (
          <div key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}: 
            <a href={key === "website" ? value.startsWith('http') ? value : `http://${value}` : `https://${value}`} target="_blank" rel="noopener noreferrer" className='linka'>
              {value}
            </a>
          </div>
        ) : null
      ))
    ) : (
      'No contact information.'
    )}
  </p>
</div>


            {/* Check if the logged-in user is the profile owner */}
            {profile.username === cookies.user && (
              <button onClick={handleEditProfile} className="buttonp">Edit Profile</button>
            )}
          </div>
        </div>
      )}

      {/* Tiles/Posts Section */}
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
                <div className="user">@{tile.username}</div>
                <div className="date">{new Date(tile.date_posted).toLocaleDateString()}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="tile">No posts available.</div>
        )}
      </div>

      {/* Footer */}
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

export default UserProfile;
