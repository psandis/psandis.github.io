import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import AboutPage from './pages/AboutPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="shell">
              <ProjectsPage />
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className="shell">
              <AboutPage />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
