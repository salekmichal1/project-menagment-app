import { useState } from 'react';
import { Project } from '../model/Project';
import './NewProjectForm.css';

interface FuncProps {
  addNewProject(newProject: Project): void;
  handleClose(): void;
  projectToEdit: Project | null;
  editProject(editedProject: Project): void;
}

export default function NewProjectForm({
  addNewProject,
  handleClose,
  projectToEdit,
  editProject,
}: FuncProps) {

  const [title, setTitle] = useState<string>(
    projectToEdit === null ? '' : projectToEdit.title
  );
  const [description, setDescripiton] = useState<string>(
    projectToEdit === null ? '' : projectToEdit.description
  );

  const resetForm = function () {
    setTitle('');
    setDescripiton('');
  };

  const handleSubmit = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (projectToEdit === null) {
      const id = crypto.randomUUID();
      const project: Project = {
        id: id,
        title: title,
        description: description,
      };
      addNewProject(project);
      resetForm();
    }

    if (projectToEdit !== null) {
      const editedProject: Project = {
        id: projectToEdit.id,
        title: title,
        description: description,
      };
      console.log(editedProject);

      editProject(editedProject);
      resetForm();
    }
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
            onChange={event => setDescripiton(event.target.value)}
            value={description}
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
