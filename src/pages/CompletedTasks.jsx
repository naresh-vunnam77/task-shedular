// components/CompleteTasks.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import Layout from '../layouts/Layout';
import CompletedTaskList from '../components/CompletedTaskList';

const CompleteTasks = () => {
  // Assuming your tasks are stored in the Redux store
  const completedTasks = []

  return (
    <Layout>
      <div className="container mx-auto mt-8 p-4">
        <h2 className="text-2xl font-semibold mb-4">Completed Tasks</h2>
        <CompletedTaskList completedTasks={ completedTasks } />
      </div>
    </Layout>
  );
};

export default CompleteTasks;
