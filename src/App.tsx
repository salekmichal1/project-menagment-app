import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Projects from './pages/Projects/Projects';
import Tasks from './pages/Tasks/Tasks';
import Login from './pages/Login/Login';

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

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks/:storyId" element={<Tasks />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
