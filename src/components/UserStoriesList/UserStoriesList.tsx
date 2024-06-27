import './UserStoriesList.css';
import { UserStory } from '../../model/UserStory';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalForm from '../ModalForm/ModalForm';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFetchData } from '../../hooks/useFetchData';
import { useAddData } from '../../hooks/useAddData';
import { useEditData } from '../../hooks/useEditData';
import { useDeleteData } from '../../hooks/useDeleteData';

export default function UserStoriesList() {
  const { state } = useAuthContext();

  const {
    data,
    error: fetchErr,
    isPending: fetchPending,
  } = useFetchData<UserStory>('UserStories');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userStoryToEdit, setUserStoryToEdit] = useState<UserStory | null>(
    null
  );
  const { addData, error: addErr, isPending: addPending } = useAddData();
  const { editData, error: editErr, isPending: editPending } = useEditData();
  const {
    deleteData,
    error: deleteErr,
    isPending: deletePending,
  } = useDeleteData();

  const projectId: string = localStorage.getItem('projectInWork')!;
  const navigate = useNavigate();

  const handleEditUserStory = function (editedUserStory: UserStory): void {
    editData('UserStories', editedUserStory.id, editedUserStory);

    handleClose();
  };

  const handleClose = () => {
    setShowModal(false);
    setUserStoryToEdit(null);
  };

  const handleDelete = function (id: string) {
    deleteData('UserStories', id);
  };

  return (
    <div className="user-stories-list">
      <h2>User stories list</h2>
      <button
        className="user-stories-list__btn btn"
        onClick={() => setShowModal(true)}>
        Add new user story
      </button>
      <div className="user-stories-list__list">
        {fetchPending && <p>Loading...</p>}
        {!fetchPending &&
          // showing only user stories that belong to the project in work
          data
            .filter(story => story.projectId === projectId)
            .map(story => (
              <div key={story.id} className="user-stories-list__story">
                <h2>{story.name}</h2>
                <p>{story.description}</p>
                <p>{story.createdBy}</p>
                <p>{story.createDate.toDate().toLocaleDateString()}</p>
                <button
                  className="btn"
                  onClick={() => {
                    setShowModal(true);
                    setUserStoryToEdit({
                      id: story.id,
                      name: story.name,
                      description: story.description,
                      priority: story.priority,
                      projectId: story.projectId,
                      createDate: story.createDate,
                      state: story.state,
                      createdBy: story.createdBy,
                    });
                  }}>
                  Edit
                </button>
                <button
                  className="btn"
                  onClick={() => navigate(`/tasks/${story.id}`)}>
                  Select
                </button>
                <button className="btn" onClick={() => handleDelete(story.id)}>
                  Delete
                </button>
              </div>
            ))}
      </div>
      {showModal && (
        <ModalForm
          fields={[
            {
              name: 'name',
              label: 'Userstory name',
              initialValue: userStoryToEdit ? userStoryToEdit.name : '',
              type: 'text',
            },
            {
              name: 'description',
              label: 'Userstory description',
              initialValue: userStoryToEdit ? userStoryToEdit.description : '',
              type: 'text',
            },
            {
              name: 'priority',
              label: 'Userstory priority',
              initialValue: userStoryToEdit ? userStoryToEdit.priority : '',
              type: 'select',
              options: [
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
              ],
            },
            {
              name: 'state',
              label: 'Userstory state',
              initialValue: userStoryToEdit ? userStoryToEdit.state : '',
              type: 'select',
              options: [
                { value: 'Todo', label: 'Todo' },
                { value: 'In progress', label: 'In progress' },
                { value: 'Done', label: 'Done' },
              ],
            },
          ]}
          onSubmit={values => {
            if (userStoryToEdit === null) {
              addData('UserStories', {
                name: values.name,
                description: values.description,
                priority: '',
                projectId: projectId,
                createDate: new Date(),
                state: 'Todo',
                createdBy: `${state.user?.name} ${state.user?.surname}`,
              });
              setShowModal(false);
            }

            if (userStoryToEdit !== null) {
              const editedUserStory: UserStory = {
                id: userStoryToEdit.id,
                name: values.name,
                description: values.description,
                priority: values.priority,
                projectId: projectId,
                createDate: userStoryToEdit.createDate,
                state: values.state,
                createdBy: userStoryToEdit.createdBy,
              };
              handleEditUserStory(editedUserStory);
            }
          }}
          onReset={handleClose}
        />
      )}
    </div>
  );
}
