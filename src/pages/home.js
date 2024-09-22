import './index.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleRegisterClick = () => {
    navigate('/register');
  };
  

  return (
    <>
      <div className="maina" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="top" style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="left" id="lm">
            <h1 id="hm">What is Co-lab</h1>
            <p>
              Co-lab is a place where you can find the artist you were looking for! Co-lab helps you to find artists for
              every work. Gigs can be organised with a tap of a finger. No more networking.
            </p>
          </div>
          <div className="rm" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="ra">
              <p className="head" style={{ fontSize: '70px', margin: '0px' }}>Co-lab</p>
              <button className="b1" onClick={handleLoginClick}>Login</button>
              
            </div>
            <div className="right" id="lm1">
              <h1 id="hm1">How does it work?</h1>
              <p>
                Sign up using the link, jump into the fun, and add a cute pic to your profile! Share what you’re good at,
                edit your info, and post gigs when you need a homie to get the job done.
              </p>
            </div>
          </div>
        </div>

        <div className="mid">
          <div className="mid1">
            <div className="gp">
              <h1>Find your gig partner today.</h1>
            </div>
            <div className="gp1">
              <h1>Signup today</h1>
            </div>
          </div>

          <div className="midr">
            <ul>
              <li>You can post your own portfolio.</li>
              <li>Find gigs through explore page.</li>
              <li>Find creators like you.</li>
              <li>Col-lab with each other.</li>
            </ul>
          </div>
        </div>

        <div className="bottom">
          <p>Well, what are you waiting for? Join in today by using the above button.</p>
        </div>
        <p className="mp">//* Co-lab™ is a non-trademarked organisation without a legal side. Please don't sue :) *//</p>
      </div>
    </>
  );
};

export default Home;
