import React, { useState } from "react";

interface AddTaskProps {
  addTask: (title: string, description: string) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3 d-flex align-items-end">
      <div className="me-2">
        <label className="form-label">Title</label>
        <input type="text"className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="me-2 flex-grow-1">
        <label className="form-label">Description</label>
        <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary ml-2">Add</button>
    </form>
  );
};

export default AddTask;
