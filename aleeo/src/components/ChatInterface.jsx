import { Box, Button, Container, For, GridItem, SimpleGrid, VStack } from '@chakra-ui/react';
import React from 'react'

function ChatInterface(props) {
    const { userData } = props;

    const [currentChat, setCurrentChat] = React.useState(userData?.conversations ? userData.conversations[0] : null);

    const chatBuilder = (conversations) => {
    return (
      <SimpleGrid
        columns={{ base: 2, md: 4 }}
        gap={{ base: "40px", md: "40px" }}
        justifyItems="start"
        justifyContent="end"
      >
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <Container>
          <h2>Conversations</h2>
          <VStack>
          {conversations?.map((convo) => ( <Button variant="ghost">{convo.title}</Button>))}
          </VStack>
          </Container>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Container>
          <h2>Chat Window</h2>
          {messageBuilder(currentChat?.messages)}
          </Container>
        </GridItem>
      </SimpleGrid>
    )
    };

    const messageClassifier = (message) => {
    if (message.role === 'user') {
      return (
        <Box
          key={message.id}
          bg="blue.100"
          borderRadius="lg"
          alignSelf="flex-end"
          maxW="70%"
          mb={2}
          px={4}
          py={2}
        >
          <p><strong>{message.role}:</strong> {message.content} </p>
        </Box>
      );
    } else {
      return (
        <Box
          key={message.id}
          bg="purple.100"
          borderRadius="lg"
          alignSelf="flex-start"
          maxW="70%"
          mb={2}
          px={4}
          py={2}
        >
          <p><strong>{message.role}:</strong> {message.content} </p>
        </Box>
      );
    }
    };

    const messageBuilder = (messages) => {
        return (
            <VStack>
            <For each={messages}>
            { (msg) => (
                messageClassifier(msg)
            )}
            </For>
            </VStack>
        )
    };

    
  return (
    <div>
        <h2>Chat Interface</h2>
        <p>Welcome, {userData?.first_name} {userData?.last_name}!</p>
        <p>Your username is: {userData?.username}</p>
        {chatBuilder(userData?.conversations)}
    {console.log("User Data in Chat Interface: ", JSON.stringify(userData, 1, 1))}
    </div>
    
  )
}

export default ChatInterface