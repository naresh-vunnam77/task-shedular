// helpers/reminder.js
export const calculateReminders = (tasks) => {
  const now = new Date().getTime();

  const reminders = tasks
    .filter((task) => task.dueDate)
    .map((task) => {
      const dueDate = new Date(task.dueDate).getTime();
      const timeRemaining = dueDate - now;

      // Check if the task is overdue
      if (timeRemaining < 0) {
        const elapsedMilliseconds = Math.abs(timeRemaining);
        const elapsedDays = Math.floor(elapsedMilliseconds / (1000 * 60 * 60 * 24));
        const elapsedHours = Math.floor((elapsedMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const elapsedMinutes = Math.floor((elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

        return {
          id: task.id,
          title: task.title,
          message: `Task overdue by: ${elapsedDays} days, ${elapsedHours} hours, ${elapsedMinutes} minutes`,
          date: task.dueDate,
        };
      } else {
        // Calculate remaining time in days, hours, and minutes
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        return {
          id: task.id,
          title: task.title,
          message: `Time remaining: ${days} days, ${hours} hours, ${minutes} minutes`,
          date: task.dueDate,
        };
      }
    });

  return reminders;
};
