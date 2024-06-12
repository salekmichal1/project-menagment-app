import './UserStoriesList.css';
import { UserStory } from '../../model/UserStory';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalForm from '../ModalForm/ModalForm';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function UserStoriesList() {
  const [userStories, setUserStories] = useState<UserStory[]>(
    JSON.parse(localStorage.getItem('userStories') || '[]')
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userStoryToEdit, setUserStoryToEdit] = useState<UserStory | null>(
    null
  );
  const { state } = useAuthContext();
  const projectId: string = localStorage.getItem('projectInWork')!;
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('userStories', JSON.stringify(userStories));
  }, [userStories]);

  const handleAddNewUserStory = function (newStory: UserStory): void {
    setUserStories(prevStory => {
      return [...prevStory, newStory];
    });

    setShowModal(false);
  };

  const handleEditUserStory = function (editedUserStory: UserStory): void {
    const targetIndex = userStories.findIndex(
      userStory => userStory.id === editedUserStory.id
    );

    const editedArray = [
      ...userStories.slice(0, targetIndex),
      editedUserStory,
      ...userStories.slice(targetIndex + 1),
    ];

    setUserStories(editedArray);
    setShowModal(false);
  };

  const handleDelete = function (id: string) {
    setUserStories(prevStory => {
      return prevStory.filter(story => {
        return id !== story.id;
      });
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setUserStoryToEdit(null);
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
        {userStories.map(story => (
          <div key={story.id} className="user-stories-list__story">
            <h2>{story.name}</h2>
            <p>{story.description}</p>
            <p>{story.createdBy}</p>
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
              const id = crypto.randomUUID();
              const userStory: UserStory = {
                id: id,
                name: values.name,
                description: values.description,
                priority: '',
                projectId: projectId,
                createDate: new Date(),
                state: 'Todo',
                createdBy: `${state.user?.name} ${state.user?.surname}`,
              };
              handleAddNewUserStory(userStory);
            }

            if (userStoryToEdit !== null) {
              const editedUserStory: UserStory = {
                id: userStoryToEdit.id,
                name: values.title,
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