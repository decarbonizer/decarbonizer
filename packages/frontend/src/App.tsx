import { useEffect, useState } from 'react';
import { getMessage } from './api/message';
import * as styles from './App.css';

export default function App() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getMessage().then((res) => setMessage(res.data.content));
  }, []);

  return (
    <div className={styles.appContainer}>
      <h1>👋🏻 Hello from the frontend!</h1>
      {message && (
        <>
          <br />
          <b>Message from the backend:</b>
          <code>{message}</code>
        </>
      )}
    </div>
  );
}
