// pages/FetchCookie.js
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';


const FetchCookie = () => {
  const [cookies] = useCookies(['user']);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch the user cookie
    const userCookie = cookies.user;
    if (userCookie) {
      setUsername(userCookie);
    }
  }, [cookies]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Fetched Cookie</h1>
      <p>User Cookie: {username || 'No cookie found'}</p>
    </div>
  );
};

export default FetchCookie;
