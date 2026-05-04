import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NotificationList from './components/NotificationList';
import Dashboard from './pages/Dashboard';
import { logger } from './logging_middleware/logger';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Campus Notifications</h1>
          <p>Priority-based notification system for students</p>
          
          <nav className="app-nav">
            <Link to="/" className="nav-link">Stage 1: Priority Filter</Link>
            <Link to="/dashboard" className="nav-link">Stage 2: Dashboard</Link>
          </nav>
        </header> 

        <main className="app-main">
          <Routes>
            <Route path="/" element={<NotificationList />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2026 Campus Notification System. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;