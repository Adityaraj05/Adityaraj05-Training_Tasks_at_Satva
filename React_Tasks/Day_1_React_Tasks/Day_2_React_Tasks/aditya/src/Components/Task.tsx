import React from 'react';

interface TaskProps {
  task: { id: number; title: string; description: string };
  deleteTask: (id: number) => void;
}

const Task: React.FC<TaskProps> = ({ task, deleteTask }) => {
  return (
    <div className="card mb-2">
      <div className="card-body d-flex justify-content-between align-items-center">

      
        <div className="d-flex flex-column">
          <h6 className="text-muted">{task.id}</h6>
          <h6 className="text-muted">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })}
          </h6>
        </div>

 
        <div className="flex-grow-1 ms-3">
          <h5 className="card-title">{task.title}</h5>
          <p className="card-text">{task.description}</p>
        </div>

  
        <button className="btn btn-danger" onClick={() => deleteTask(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Task;
