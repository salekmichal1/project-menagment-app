import { useEffect, useState } from 'react';
import { Project } from '../model/project';
import NewProjectForm from './NewProjectForm';
import './ProjectList.css';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>(
    JSON.parse(localStorage.getItem('projects') || '[]')
  );
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addNewProject = function (newProject: Project): void {
    setProjects(prevProjects => {
      return [...prevProjects, newProject];
    });

    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleDelete = function (id: string) {
    setProjects(prevProjects => {
      return prevProjects.filter(project => {
        return id !== project.id;
      });
    });
  };

  return (
    <div className="project-list">
      <button
        className="project-list__btn btn"
        onClick={() => setShowModal(true)}>
        Add new project
      </button>
      <div className="project-list__list">
        {projects.map(project => (
          <div key={project.id} className="project-list__project">
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <button className="btn">Edit</button>
            <button className="btn" onClick={() => handleDelete(project.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      {showModal && (
        <NewProjectForm
          addNewProject={addNewProject}
          handleClose={handleClose}
        />
      )}
    </div>
  );
}
