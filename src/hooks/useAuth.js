import { useState } from 'react';

const BASE_URL = 'http://localhost:7070/api/v1/auth';

const useAuth = (actionType) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authenticate = async (email, password) => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/${actionType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log(data);

      if (data.token && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
      } else {
        setError(data.message || `Failed to ${actionType}`);
      }
    } catch (error) {
      setError(`Failed to ${actionType}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, authenticate };
};

export default useAuth;
