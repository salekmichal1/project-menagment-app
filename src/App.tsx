import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import { error, log } from 'console';

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

  const fetchData = async function () {
    try {
      const testApi = await fetch('http://localhost:3001/');
      if (!testApi.ok) {
        throw Error(testApi.statusText);
      }
      const testApiData = await testApi;
      console.log(testApiData);
    } catch (err) {
      console.error(err);
    }
  };
  console.log(fetchData());

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
