import { useState } from 'react';
import { Project } from '../model/project';
import './NewProjectForm.css';

interface FuncProps {
  addNewProject(newProject: Project): void;
  handleClose(): void;
}

export default function NewProjectForm({
  addNewProject,
  handleClose,
}: FuncProps) {
  const [title, setTitle] = useState<string>('');
  const [desctription, setDesctripiton] = useState<string>('');

  const resetForm = function () {
    setTitle('');
    setDesctripiton('');
  };

  const handleSubmit = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = crypto.randomUUID();
    const project: Project = {
      id: id,
      title: title,
      description: desctription,
    };
    console.log(project);
    addNewProject(project);
    resetForm();
  };

  return (
    <div className="modal-overlay">
      <form className="new-project-form" onSubmit={handleSubmit}>
        <label>
          <span>Project Title:</span>
          <input
            type="text"
            onChange={event => setTitle(event.target.value)}
            value={title}
            // ref={title}
          />
        </label>

        <label>
          <span>Project description:</span>
          <input
            type="text"
            onChange={event => setDesctripiton(event.target.value)}
            value={desctription}
            // ref={title}
          />
        </label>

        <button className="btn">Submit</button>
        <button type="submit" className="btn" onClick={handleClose}>
          Close
        </button>
      </form>
    </div>
  );
}
