import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import { log } from 'console';

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

  let refreshToken = '';

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
      refreshToken = testApiData.refreshToken;
      console.log(testApiData.token, refreshToken);

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  postData();

  const fetchData = async function () {
    try {
      const protectedApi = await fetch('http://localhost:3000/protected/10', {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const protectedApiData = await protectedApi.json();
      console.log(protectedApiData.message);
    } catch (err) {
      console.error(err);
    }
  };

  // fetchData();

  const logout = async function () {
    try {
      console.log(refreshToken);

      const logoutApi = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshToken }),
      });

      const logoutApiRes = await logoutApi.json();
      console.log(logoutApiRes.message);
    } catch (err) {
      console.error(err);
    }
  };

  setTimeout(() => logout(), 5000);

  setTimeout(() => fetchData(), 7000);

  setTimeout(() => fetchData(), 12000);

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
