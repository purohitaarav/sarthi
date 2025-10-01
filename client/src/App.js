import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SpiritualHome from './pages/SpiritualHome';
import Users from './pages/Users';
import Items from './pages/Items';
import SpiritualGuidance from './pages/SpiritualGuidance';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guidance" element={<SpiritualHome />} />
          <Route path="/users" element={<Users />} />
          <Route path="/items" element={<Items />} />
          <Route path="/spiritual" element={<SpiritualGuidance />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
