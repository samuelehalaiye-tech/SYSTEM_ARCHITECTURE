const defineTask = jest.fn();
const isTaskRegisteredAsync = jest.fn().mockResolvedValue(false);
const unregisterAllTasksAsync = jest.fn().mockResolvedValue(undefined);

module.exports = { defineTask, isTaskRegisteredAsync, unregisterAllTasksAsync };
