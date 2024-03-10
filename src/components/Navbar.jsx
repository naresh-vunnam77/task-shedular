import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Notification from './Notifications';
import { useNavigate } from 'react-router-dom';
import useTaskApi from '../hooks/useTaskApi';

const NavBar = () => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [reminderCount, setReminderCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  let isAuthenticated = false;

  if (user && token) {
    isAuthenticated = true;
  }

  const navigate = useNavigate();
  const { tasks, loading } = useTaskApi(token);

  useEffect(() => {
    const fetchAndSetReminderCount = async () => {
      try {
        const pendingTasksCount = tasks.filter(task => task.status === 'pending').length;
        setReminderCount(pendingTasksCount);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchAndSetReminderCount();
  }, [tasks]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleToggleNotification = () => {
    setIsNotificationVisible(!isNotificationVisible);

    // If the modal is being closed, you might want to clear the reminders
    if (!isNotificationVisible) {
      setReminderCount(0);
      localStorage.setItem('reminderCount', '0');
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <NavLink to="/" className="text-white text-lg font-semibold">
            Your Logo
          </NavLink>
        </div>
        <div className="flex items-center space-x-4 ">
          { isAuthenticated ? (
            <>
              <NavLink to="/completed-tasks" className="text-gray-300 hover:text-white px-10 ">
                Completed Tasks
              </NavLink>
              <button onClick={ handleLogout } className="text-gray-300 hover:text-white mr-24 px-10">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signup" className="text-gray-300 hover:text-white">
                Sign Up
              </NavLink>
              <NavLink to="/login" className="text-gray-300 hover:text-white">
                Login
              </NavLink>
            </>
          ) }
          {/* Bell Icon with Notification Count */ }
          { isAuthenticated && (
            <span className="text-gray-300 hover:text-white relative">
              { reminderCount > 0 && (
                <span className="absolute top-0 right-[80px] bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                  { reminderCount }
                </span>
              ) }
              <button className="ml-5" onClick={ handleToggleNotification }>
                Reminders
              </button>
            </span>
          ) }
        </div>
      </div>
      { isAuthenticated && isNotificationVisible && (
        <div className="w-[400px] fixed top-15 right-0 m-4 rounded-sm">
          {/* Render your notification component here */ }
          <Notification onClose={ handleToggleNotification } setReminderCount={ setReminderCount } />
        </div>
      ) }
    </nav>
  );
};

export default NavBar;
