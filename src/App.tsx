import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';

function App() {
  if (
    localStorage.getItem('projects') === null ||
    localStorage.getItem('projects') === ''
  ) {
    localStorage.setItem('projects', JSON.stringify([]));
  }
  if (localStorage.getItem('projectInWork') === null) {
    localStorage.setItem('projectInWork', '');
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
