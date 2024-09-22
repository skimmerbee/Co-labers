import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Main from './pages/main';
import FetchCookie from './pages/fetchcookie';
import User from './pages/user'; // User profile component
import UserProfile from './pages/edituser'; // Named export
import Add from './pages/add';
import Search from './pages/search'; // Import Search component

const App = () => {
  const [cookies] = useCookies(['username']); // Access cookies

  return (
    <CookiesProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:username" element={<User />} /> {/* User profile route */}
        <Route path="/edit-profile/:username" element={<UserProfile />} /> {/* Edit profile route */}
        <Route path="/main" element={<Main />} />
        <Route path="/fetch-cookie" element={<FetchCookie />} /> {/* Fetch cookie route */}
        <Route path="/add" element={<Add />} />
        <Route path="/search" element={<Search />} /> {/* Search route */}
      </Routes>
    </CookiesProvider>
  );
};

export default App;
