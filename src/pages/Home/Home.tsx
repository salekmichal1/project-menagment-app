import { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../model/Project';
import UserStoriesList from '../../components/UserStoriesList/UserStoriesList';
import { useFetchData } from '../../hooks/useFetchData';
import { doc, getDoc } from 'firebase/firestore';
import { projectDatabase } from '../../firebase/config';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const findProject = async (id: string) => {
      const docRef = doc(projectDatabase, 'Projects', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const projectData = docSnap.data() as Project;
        const id = docSnap.id;
        projectData.id = id;
        setSelectedProject(projectData);
      } else {
        setSelectedProject(null);
        navigate('/projects');
      }
    };

    const projectId = localStorage.getItem('projectInWork');
    if (projectId) {
      findProject(projectId);
    }
  }, [navigate]);

  return (
    <div>
      <h2>Selected project</h2>
      <h3>Name: {selectedProject?.title}</h3>
      <h3>Description: {selectedProject?.description}</h3>
      <UserStoriesList />
      <span>Id: {selectedProject?.id}</span>
    </div>
  );
}
