import { useEffect, useState } from 'react';
import { Project } from '../../model/Project';
import ModalForm from '../ModalForm/ModalForm';
import './ProjectList.css';
import { useNavigate } from 'react-router-dom';
import { useFetchData } from '../../hooks/useFetchData';
import { useDeleteData } from '../../hooks/useDeleteData';
import { useAddData } from '../../hooks/useAddData';
import { useEditData } from '../../hooks/useEditData';

export default function ProjectList() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const {
    data,
    error: fetchErr,
    isPending: fetchPending,
  } = useFetchData<Project>('Projects');

  const { addData, error: addErr, isPending: addPending } = useAddData();
  const { editData, error: editErr, isPending: editPending } = useEditData();
  const {
    deleteData,
    error: deleteErr,
    isPending: deletePending,
  } = useDeleteData();

  // const [projects, setProjects] = useState<Project[]>(data);

  const navigate = useNavigate();
  // console.log(projects);

  // useEffect(() => {
  //   setProjects(data);
  // }, [data]);

  const handleAddNewProject = function (newProject: Project): void {
    addData('Projects', newProject);
    // setProjects(prevProjects => {
    //   return [...prevProjects, newProject];
    // });

    setShowModal(false);
  };

  const handleEditProject = function (editedProject: Project): void {
    editData('Projects', editedProject.id, editedProject);
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setProjectToEdit(null);
    console.log(projectToEdit);
  };

  const handleSelectProject = function (id: string) {
    localStorage.setItem('projectInWork', id);
    navigate('/');
  };

  const handleDelete = function (id: string) {
    deleteData('Projects', id);

    // setProjects(prevProjects => {
    //   return prevProjects.filter(project => {
    //     return id !== project.id;
    //   });
    // });
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
        {fetchPending && <div>Loading...</div>}
        {!fetchPending &&
          data.map(project => (
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
        <ModalForm
          fields={[
            {
              name: 'title',
              label: 'Project title',
              initialValue: projectToEdit ? projectToEdit.title : '',
              type: 'text',
            },
            {
              name: 'description',
              label: 'Project description',
              initialValue: projectToEdit ? projectToEdit.description : '',
              type: 'text',
            },
          ]}
          onSubmit={values => {
            if (projectToEdit === null) {
              // const project: Project = {
              //   title: values.title,
              //   description: values.description,
              // };
              // handleAddNewProject(project);

              // adding here because we don't have the id of the project at this point
              addData('Projects', {
                title: values.title,
                description: values.description,
              });
              // setProjects(prevProjects => {
              //   return [...prevProjects, newProject];
              // });

              setShowModal(false);
            }

            if (projectToEdit !== null) {
              const editedProject: Project = {
                id: projectToEdit.id,
                title: values.title,
                description: values.description,
              };
              handleEditProject(editedProject);
            }
          }}
          onReset={handleClose}
        />
      )}
    </div>
  );
}
