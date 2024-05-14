import { useEffect, useState } from 'react';
import { UserStory } from '../model/UserStory';
import './NewStoryForm.css'
import { useAuthContext } from '../hooks/useAuthContext';

export default function NewStoryForm({ handleAddNewUserStory, handleClose, handleEditUserStory, setUserStoryToEdit, userStoryToEdit }: {
  handleAddNewUserStory(newStory: UserStory): void;
  handleClose(): void;
  handleEditUserStory(editedUserStory: UserStory): void;
  setUserStoryToEdit: React.Dispatch<React.SetStateAction<UserStory | null>>;
  userStoryToEdit: UserStory | null;
}) {
  const { state } = useAuthContext();
  const [name, setName] = useState<string>(userStoryToEdit === null ? '' : userStoryToEdit.name);
  const [description, setDesctripiton] = useState<string>(userStoryToEdit === null ? '' : userStoryToEdit.description);

  console.log(userStoryToEdit);

  const resetForm = function () {
    setName('');
    setDesctripiton('');
    setUserStoryToEdit(null);
  };

  const handleSubmit = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (userStoryToEdit === null) {
      const id = crypto.randomUUID();
      const userStory: UserStory = {
        id: id,
        name: name,
        description: description,
        priority: '',
        projectId: localStorage.getItem('projectInWork')!,
        createDate: new Date(),
        state: 'Todo',
        createdBy: `${state.user?.name} ${state.user?.surname}`
      };
      handleAddNewUserStory(userStory);
      
      resetForm();
    }

    if (userStoryToEdit !== null) {
      const editedUserStory: UserStory = {
        id: userStoryToEdit.id,
        name: name,
        description: description,
        priority: '',
        projectId: localStorage.getItem('projectInWork')!,
        createDate: new Date(),
        state: 'Todo',
        createdBy: `${state.user?.name} ${state.user?.surname}`
      };
      handleEditUserStory(editedUserStory);
      resetForm();
    }
  };

  return (
    <div className="modal-overlay">
      <form className="new-project-form" onSubmit={handleSubmit}>
        <label>
          <span>Story title:</span>
          <input
            type="text"
            onChange={event => setName(event.target.value)}
            value={name}
          // ref={title}
          />
        </label>

        <label>
          <span>Story description:</span>
          <input
            type="text"
            onChange={event => setDesctripiton(event.target.value)}
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
  )
}
