import { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../model/Project';
import UserStoriesList from '../../components/UserStoriesList/UserStoriesList';
import { doc, getDoc } from 'firebase/firestore';
import { projectDatabase } from '../../firebase/config';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const findProject = async (id: string | null) => {
      try {
        if (id) {
          const docRef = doc(projectDatabase, 'Projects', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const projectData = docSnap.data() as Project;
            const id = docSnap.id;
            projectData.id = id;
            setSelectedProject(projectData);
          } else {
            setSelectedProject(null);
            localStorage.setItem('projectInWork', '');
            navigate('/projects');
          }
        } else {
          setSelectedProject(null);
          localStorage.setItem('projectInWork', '');
          navigate('/projects');
        }
      } catch (err) {
        console.error(err);
      }
    };

    const projectId = localStorage.getItem('projectInWork');

    findProject(projectId);
  }, [navigate]);

  return (
    <div>
      <div className="user-stories-list__head">
        <h2>Selected project</h2>
        <h3>Name: {selectedProject?.title}</h3>
        <h3>Description: {selectedProject?.description}</h3>
      </div>
      <UserStoriesList />
      <span style={{ marginLeft: '36px', paddingBottom: '24px' }}>
        Id: {selectedProject?.id}
      </span>
    </div>
  );
}
