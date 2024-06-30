import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Projects from './pages/Projects/Projects';
import Tasks from './pages/Tasks/Tasks';
import Login from './pages/Login/Login';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { state } = useAuthContext();
  
  if (localStorage.getItem('projectInWork') === null) {
    localStorage.setItem('projectInWork', '');
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
