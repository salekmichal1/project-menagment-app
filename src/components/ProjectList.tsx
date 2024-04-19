import { useEffect, useState } from 'react';
import { Project } from '../model/project';
import NewProjectForm from './NewProjectForm';
import './ProjectList.css';
import { useNavigate } from 'react-router-dom';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>(
    JSON.parse(localStorage.getItem('projects') || '[]')
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const handleAddNewProject = function (newProject: Project): void {
    setProjects(prevProjects => {
      return [...prevProjects, newProject];
    });

    setShowModal(false);
  };

  const handleEditProject = function (editedProject: Project): void {
    const targetIndex = projects.findIndex(
      project => project.id === editedProject.id
    );

    const editedArray = [
      ...projects.slice(0, targetIndex),
      editedProject,
      ...projects.slice(targetIndex + 1),
    ];

    setProjects(editedArray);
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSelectProject = function (id: string) {
    localStorage.setItem('projectInWork', id);
    navigate('/');
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
      {localStorage.getItem('projectInWork') === '' && (
        <h3>None of the projects were selected</h3>
      )}
      <div className="project-list__list">
        {projects.map(project => (
          <div key={project.id} className="project-list__project">
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <button
              className="btn"
              onClick={() => {
                setShowModal(true);
                setProjectToEdit({
                  id: project.id,
                  title: project.title,
                  description: project.description,
                });
              }}>
              Edit
            </button>
            <button
              className="btn"
              onClick={() => handleSelectProject(project.id)}>
              Select
            </button>
            <button className="btn" onClick={() => handleDelete(project.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      {showModal && (
        <NewProjectForm
          addNewProject={handleAddNewProject}
          handleClose={handleClose}
          projectToEdit={projectToEdit}
          editProject={handleEditProject}
        />
      )}
    </div>
  );
}
