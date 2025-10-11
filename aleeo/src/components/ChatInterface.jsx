import { Box, Button, Container, For, GridItem, SimpleGrid, VStack } from '@chakra-ui/react';
import React from 'react'

function ChatInterface(props) {
    const { userData } = props;

    const [currentChat, setCurrentChat] = React.useState(userData?.conversations ? userData.conversations[0] : null);

    const chatBuilder = (conversations) => {
    return (
      <SimpleGrid
        columns={{ base: 5, md: "1fr 4fr" }}
        gap={{ base: "24px", md: "40px" }}
        width="100vw"
        height="100vh"
        minH="100vh"
        minW="100vw"
        position="fixed"
        top={0}
        left={0}
      >
        <GridItem colSpan={1}>
          <Container height="100%">
            <h2>Conversations</h2>
            <VStack>
              {conversations?.map((convo) => (<Button variant="ghost">{convo.title}</Button>))}
            </VStack>
          </Container>
        </GridItem>
        <GridItem colSpan={4}>
          <Container height="100%">
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
        {chatBuilder(userData?.conversations)}
    {console.log("User Data in Chat Interface: ", JSON.stringify(userData, 1, 1))}
    </div>
    
  )
}

export default ChatInterface