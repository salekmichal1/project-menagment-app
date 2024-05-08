import { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { Project } from '../model/Project';
import UserStoriesList from '../components/UserStoriesList';
export default function Home() {
  const [projects, setProjects] = useState<Project[]>(
    JSON.parse(localStorage.getItem('projects') || '[]')
  );

  const navigate = useNavigate();

  const selectedProject: Project | undefined = projects.find(
    project => project.id === localStorage.getItem('projectInWork')
  );
  useEffect(() => {
    if (selectedProject === undefined) {
      navigate('/projects');
    }
  }, [navigate, selectedProject]);
  
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
