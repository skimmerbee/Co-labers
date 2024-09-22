import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './index.css';
import searchIcon from '../img/search.svg';
import profileIcon from '../img/profile.svg';
import homeIcon from '../img/home.svg';
import addIcon from '../img/add.svg';
import exploreIcon from '../img/explore.svg';

// Header component
const Header = () => {
    const navigate = useNavigate();
    const username = useCookies(['user'])[0].user; // Get username from cookies

    return (
        <header>
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

const AddPost = () => {
    const [cookies] = useCookies(['user']);
    const [content, setContent] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const username = cookies.user;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:5000/tags');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAvailableTags(data.map(tag => tag.name));
            } catch (error) {
                console.error('Failed to fetch tags:', error);
            }
        };
        fetchTags();
    }, []);

    const handleTagSelect = (e) => {
        const tag = e.target.value;
        if (tag) {
            setSelectedTag(tag); // Only allow one selected tag
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const date_posted = new Date().toISOString();
    
        // Create the new post object
        const newPost = {
            username,
            content,
            tags: selectedTag, // Just use the single selected tag
            date_posted
        };
    
        console.log('New Post:', newPost); // Log to check the new post object
    
        try {
            const response = await fetch('http://localhost:5000/addpost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost),
            });
    
            if (response.ok) {
                console.log('Post added successfully');
                setContent('');
                setSelectedTag('');
                setMessage('Post added successfully!');
            } else {
                setMessage('Failed to add post. Please try again.');
                console.error('Failed to add post');
            }
        } catch (error) {
            setMessage('Error occurred while adding post.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content">
            <Header />
            <div className="usercarda">
                <div className="cardwriter">
                    <h1>New</h1>
                    <h1> Gig </h1>
                    <h1> ?</h1>
                </div>
                <form onSubmit={handleSubmit} className="cardmainb">
                    <p>Enter your gig info:</p>
                    <textarea
                        className="editsp"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="Describe your gig..."
                    />
                    <p>Give the tag:</p>
                    <select onChange={handleTagSelect} value={selectedTag}>
                        <option value="">Select a tag</option>
                        {availableTags.map(tag => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>

                    <div>
                        <h4>Selected Tag:</h4>
                        {selectedTag && (
                            <div className="selected-tag">
                                {selectedTag}
                                <span onClick={() => setSelectedTag('')} className="remove-tag">✖</span>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Post'}
                    </button>

                    {message && <p className="message">{message}</p>}
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default AddPost;
