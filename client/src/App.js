import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SpiritualHome from './pages/SpiritualHome';
import History from './pages/History';
import Reflections from './pages/Reflections';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SpiritualHome />} />
          <Route path="/history" element={<History />} />
          <Route path="/reflections" element={<Reflections />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
