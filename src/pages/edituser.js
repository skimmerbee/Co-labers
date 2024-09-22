import React, { useState } from 'react';
import './index.css';
import searchIcon from '../img/search.svg';
import profileIcon from '../img/profile.svg';
import homeIcon from '../img/home.svg';
import addIcon from '../img/add.svg';
import exploreIcon from '../img/explore.svg';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';

const UserProfileEdit = () => {
    const { username } = useParams();
    const [cookies] = useCookies(['user']);
    const [bio, setBio] = useState('');
    const [tags, setTags] = useState('');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
    const [instagram, setInstagram] = useState('');
    const [twitter, setTwitter] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!cookies.user || username !== cookies.user) {
            setError('Permission denied.');
            setLoading(false);
            return;
        }
    
        if (!isValidEmail(email)) {
            setError('Invalid email format.');
            setLoading(false);
            return;
        }
    
        const data = {
            username,
            bio,
            tags: tags.split(',').map(tag => tag.trim()), // Adjust as needed
            location,
            contact: {
                website,
                instagram,
                twitter,
                email,
            },
        };
    
        try {
            const response = await fetch('http://localhost:5000/edit-post', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include',
            });
    
            if (response.ok) {
                setSuccess(true);
                console.log('Profile updated successfully.');
            } else {
                setError('Error updating profile: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while updating profile:', error);
            setError('Failed to update profile. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    

    const handleHomeClick = () => navigate('/main');
    const handleAddClick = () => navigate('/add');
    const handleExploreClick = () => navigate('/explore');

    return (
        <div className="main">
            <header>
                <button className="icon" onClick={() => navigate('/search')} >
                    <img src={searchIcon} alt="Search" width="30" height="30" />
                </button>
                <h2 className="co">Co-lab</h2>
                <button className="icon" onClick={() => navigate(`/profile/${username}`)}>
                    <img src={profileIcon} alt="Profile" width="30" height="30" />
                </button>
            </header>

            <div className="content">
                <div className="usercarda">
                    <div className="cardwritea">
                        <h1>{username}</h1>
                    </div>
                    <form className="cardmaina" onSubmit={handleSubmit}>
                        <p className="texted">
                            About: 
                            <input type="text" className="edit" value={bio} onChange={(e) => setBio(e.target.value)} />
                        </p>
                        <p className="texted">
                            Skills: 
                            <input type="text" className="edit" value={tags} onChange={(e) => setTags(e.target.value)} />
                        </p>
                        <p className="texted">
                            Location: 
                            <input type="text" className="edit" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </p>
                        <p className="texted">
                            Website: 
                            <input type="text" className="edit" value={website} onChange={(e) => setWebsite(e.target.value)} />
                        </p>
                        <p className="texted">
                            Instagram: 
                            <input type="text" className="edit" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                        </p>
                        <p className="texted">
                            Twitter: 
                            <input type="text" className="edit" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                        </p>
                        <p className="texted">
                            Email: 
                            <input type="text" className="edit" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </p>
                        {error && <p className="error">{error}</p>}
                        {loading && <p className="loading">Loading...</p>}
                        {success && <p className="success">Profile updated successfully!</p>}
                        <button type="submit" className="buttonpa">Save Changes</button>
                    </form>
                </div>
            </div>

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
        </div>
    );
};

export default UserProfileEdit;
