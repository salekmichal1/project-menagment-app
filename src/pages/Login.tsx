import { useState } from 'react';
import './Login.css';
import { useLogin } from '../hooks/useLogin';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isPending, error } = useLogin();

  const handleSubmit = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login(username, password);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          <span>Username:</span>
          <input
            type="text"
            onChange={event => setUsername(event.target.value)}
            value={username}
          />
        </label>

        <label>
          <span>Password:</span>
          <input
            type="password"
            onChange={event => setPassword(event.target.value)}
            value={password}
          />
        </label>
        <button className="btn">Submit</button>
      </form>
    </div>
  );
}
