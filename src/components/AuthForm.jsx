import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AuthForm = ({ title, actionType }) => {
  const { loading, error, authenticate } = useAuth(actionType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setErrorMessages(errors);

    return Object.keys(errors).length === 0;
  };

  const handleAction = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await authenticate(email, password);
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (user && token) {
        navigate('/');
      }
    } catch (error) {
      // Handle more specific error messages based on your API response
      console.error('Authentication error:', error);
    }
  };

  return (
    <section className="text-gray-400 bg-gray-900 body-font max-h-screen w-full px-5 md:px-10 overflow-hidden">
      <div className="container mx-auto flex flex-wrap items-center">
        {/* Hide image on small screens */ }
        <div className="lg:w-1/2 md:w-1/2 md:pr-16 lg:pr-0 pr-0 hidden md:block">
          <img src={ require("../assets/undraw_enter.svg").default } alt="" className="w-full h-auto md:h-[400px] lg:h-full object-cover" />
        </div>
        <div className="lg:w-1/2 md:w-1/2 bg-gray-800 bg-opacity-50 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <nav className="flex justify-center mb-4">
            <NavLink to="/signup" className={ `mr-4 text-white px-5 py-2 ${actionType === 'signup' && 'border-b-2 border-indigo-900'}` } activeClassName="border-b-2 border-indigo-900">Sign Up</NavLink>
            <NavLink to="/login" className={ `text-white px-5 py-2 ${actionType === 'login' && 'border-b-2 border-indigo-900'}` } activeClassName="border-b-2 border-indigo-500">Login</NavLink>
          </nav>

          <form onSubmit={ handleAction } className="w-full">
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-400">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                onChange={ (e) => setEmail(e.target.value) }
                required
              />
              { errorMessages.email && <p className="text-red-500 mt-2">{ errorMessages.email }</p> }
            </div>
            <div className="relative mb-4">
              <label htmlFor="password" className="leading-7 text-sm text-gray-400">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                onChange={ (e) => setPassword(e.target.value) }
                required
                minLength="6"
              />
              { errorMessages.password && <p className="text-red-500 mt-2">{ errorMessages.password }</p> }
            </div>
            <button
              type="submit"
              className={ `text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg ${loading && 'opacity-50 cursor-not-allowed'}` }
              disabled={ loading }
            >
              { loading ? 'Loading...' : title }
            </button>
            {/* Display error message if there's an error */ }
            { error && <p className="text-red-500 mt-2">{ error }</p> }
          </form>

          <p className="text-xs mt-3 text-center">
            { title === 'Sign Up' ? "Already have an account? Please" : "Don't have an account? Please" }
            <NavLink
              to={ title === 'Sign Up' ? "/login" : "/signup" }
              className="ml-2 font-bold text-blue-200 px-3 py-2 rounded-sm"
              activeClassName="border-b-2 border-indigo-900"
            >
              { title === 'Sign Up' ? 'Login' : 'Sign Up' }
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
