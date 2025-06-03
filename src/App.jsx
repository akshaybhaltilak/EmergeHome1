import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import ProductPage from './Pages/ProductPage/ProductPage';
import AdminPanel from './Pages/AdminPanel/AdminPanel';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Navbar from './Components/Header/Header';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;