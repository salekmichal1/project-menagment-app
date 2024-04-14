import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  if (
    localStorage.getItem('projects') === null ||
    localStorage.getItem('projects') === ''
  ) {
    localStorage.setItem('projects', JSON.stringify([]));
  }
  return (
    <div className="App">
      <Navbar />
      <Home />
    </div>
  );
}

export default App;
