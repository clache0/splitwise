import "../../styles/components/general/PasswordPrompt.css"
import React, { useState } from 'react';

interface PasswordPromptProps {
  onAuthenticate: (password: string, remember: boolean) => void;
}

const PasswordPrompt: React.FC<PasswordPromptProps> = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRememberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemember(event.target.checked);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAuthenticate(password, remember);
  };

  return (
    <div className="password-prompt-container">
      <form onSubmit={handleSubmit}>
        <label>
          Enter Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={remember}
            onChange={handleRememberChange}
          />
          Remember me
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PasswordPrompt;

