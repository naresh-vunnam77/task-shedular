// Layout.js
import React from 'react';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">{ children }</main>
      <Footer />
    </div>
  );
};

export default Layout;
