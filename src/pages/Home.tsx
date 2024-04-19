import { useEffect, useState } from 'react';
import './Home.css';
import { Project } from '../model/project';
import { useNavigate } from 'react-router-dom';
export default function Home() {
  const [projects, setProjects] = useState<Project[]>(
    JSON.parse(localStorage.getItem('projects') || '[]')
  );

  const navigate = useNavigate();

  const selectedProject: Project | undefined = projects.find(
    project => project.id === localStorage.getItem('projectInWork')
  );
  console.log(selectedProject);
  useEffect(() => {
    if (selectedProject === undefined) {
      navigate('/projects');
    }
  }, []);
  return (
    <div>
      <h2>Selected project</h2>
      <h3>Name: {selectedProject?.title}</h3>
      <h3>Description: {selectedProject?.description}</h3>
      <span>Id: {selectedProject?.id}</span>
    </div>
  );
}
