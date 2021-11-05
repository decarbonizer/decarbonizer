import { useEffect, useState } from 'react';
import { getMessages } from './api/message';
import * as styles from './App.css';

export default function App() {
  const [messages, setMessages] = useState<Array<string>>([]);

  useEffect(() => {
    getMessages().then((res) => setMessages(res.data.map((message) => message.content)));
  }, []);

  return (
    <div className={styles.appContainer}>
      <h1>👋🏻 Hello from the frontend!</h1>
      {messages.length ? (
        <>
          <br />
          <b>Messages from the backend:</b>
          {messages.map((message, i) => (
            <code key={i}>{message}</code>
          ))}
        </>
      ) : (
        <b>
          No messages found. Create some via <code>http://localhost:3000/swagger</code>.
        </b>
      )}
    </div>
  );
}
