import React, { useState } from "react";
import TaskList from "./Components/TaskList";
import AddTask from "./Components/AddTask";

interface Task {
  id: number;
  title: string;
  description: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Learn React", description: "Understand the basics of React" },
    { id: 2, title: "Practice TypeScript", description: "Work on TS integration with React" },
    { id: 3, title: "Build a Project", description: "Create a to-do list app" },
    { id: 4, title: "Read about Hooks", description: "Explore useState and useEffect" },
    { id: 5, title: "Improve UI", description: "Use Bootstrap for styling" },
  ]);

 

  const addTask = (title: string, description: string) => {
    if (title.trim() && description.trim()) {
      const newTask: Task = {
        id: tasks.length + 1,
        title,
        description,
      };
      setTasks([...tasks, newTask]);
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="d-flex flex-column vh-100 vw-100 justify-content-center align-items-center">
      <h1 className="mb-4 position-fixed top-0 w-100 bg-white text-center py-3 shadow-sm">My Todo List</h1>
      <div className="text-center w-50 mt-5 pt-5">
        <div className="card p-4 shadow-lg w-100" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <AddTask addTask={addTask} />
          <TaskList tasks={tasks} deleteTask={deleteTask} />
        </div>
      </div>
    </div>
  );
};

export default App;
