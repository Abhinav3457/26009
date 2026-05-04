import './App.css';
import NotificationList from './components/NotificationList';
import { logger } from './logging_middleware/logger';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Campus Notifications</h1>
        <p>Priority-based notification system for students</p>
      </header> 
      <main className="app-main">
        <NotificationList />
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Campus Notification System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;