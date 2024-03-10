import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import SignUpForm from './pages/SignUpForm';
import Home from './pages/Home';
import TaskDetails from './components/TaskDetails';
import CompletedTasks from './pages/CompletedTasks'
import AuthForm from './components/AuthForm';
import useAuthStatus from "./hooks/useAuthStatus"

function App() {
  const isAuthenticated = useAuthStatus();
  console.log(isAuthenticated)
  return (
    <div >
      <Router>
        <Routes>
          <Route path='/login' Component={ LoginForm } />
          <Route path='/signup' Component={ SignUpForm } />
          <Route path="/tasks/:taskId" Component={ TaskDetails } />
          <Route path='/' Component={ Home } />
          <Route path='/completed-tasks' Component={ CompletedTasks } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
