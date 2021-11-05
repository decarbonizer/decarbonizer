import { useEffect, useState } from 'react';
import { Flex, Heading, Text, Code } from '@chakra-ui/react';
import { getMessages } from './api/message';

export default function Hello() {
  const [messages, setMessages] = useState<Array<string>>([]);

  useEffect(() => {
    getMessages().then((res) => setMessages(res.data.map((message) => message.content)));
  }, []);

  return (
    <Flex w="100%" h="100%" justify="center" align="center" direction="column">
      <Heading as="h1">👋🏻 Hello from the frontend!</Heading>
      {messages.length ? (
        <>
          <br />
          <Text fontWeight="bold">Messages from the backend:</Text>
          {messages.map((message, i) => (
            <Code key={i}>{message}</Code>
          ))}
        </>
      ) : (
        <Text fontWeight="bold">
          Messages from the backend: No messages found. Create some via <Code>http://localhost:3000/swagger</Code>.
        </Text>
      )}
    </Flex>
  );
}
