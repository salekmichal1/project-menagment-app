import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';

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
  if (
    localStorage.getItem('userStories') === null ||
    localStorage.getItem('userStories') === ''
  ) {
    localStorage.setItem('userStories', JSON.stringify([]));
  }
  if (
    localStorage.getItem('tasks') === null ||
    localStorage.getItem('tasks') === ''
  ) {
    localStorage.setItem('tasks', JSON.stringify([]));
  }

  const fetchData = async function () {
    try {
      const testApi = await fetch('http://localhost:3000');
      if (!testApi.ok) {
        throw Error(testApi.statusText);
      }
      const testApiData = await testApi.json();
      console.log(testApiData.message);
    } catch (err) {
      console.error(err);
    }
  };
  fetchData();

  const postData = async function () {
    try {
      const testApi = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'test', password: 'test' }),
      });
      if (!testApi.ok) {
        throw Error(testApi.statusText);
      }

      const testApiData = await testApi.json();
      console.log(testApiData.token);

      const protectedApi = await fetch(
        'http://localhost:3000/protected/10/1000',
        {
          headers: {
            Authorization: `Bearer ${testApiData.token}`,
          },
        }
      );

      const protectedApiData = await protectedApi.json();
      console.log(protectedApiData.message);
    } catch (err) {
      console.error(err);
    }
  };

  postData();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks/:storyId" element={<Tasks />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
