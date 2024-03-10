// TaskDetails.js
import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../UI/Loader';
import useTaskApi from '../hooks/useTaskApi';

const TaskDetails = () => {
  const token = localStorage.getItem('token');
  const { taskId } = useParams();
  const { task, loading, fetchTaskById } = useTaskApi(token);

  const memoizedFetchTaskById = useCallback(() => {
    fetchTaskById(taskId);
  }, [fetchTaskById, taskId]);

  useEffect(() => {
    memoizedFetchTaskById();
  }, [memoizedFetchTaskById]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!task) {
    return <p>Error loading task details</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Task Details</h2>
      <div>
        <h3 className="text-xl font-semibold">{ task.title }</h3>
        <p className="text-sm">Due: { new Date(task.date).toLocaleDateString() }</p>
        <p>{ task.description }</p>
      </div>
    </div>
  );
};

export default TaskDetails;
