import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
      {state.authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route
              path="/login"
              element={state.user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={!state.user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/projects"
              element={!state.user ? <Projects /> : <Navigate to="/login" />}
            />
            <Route
              path="/tasks/:storyId"
              element={!state.user ? <Tasks /> : <Navigate to="/login" />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
