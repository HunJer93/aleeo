import { Box, Button, Container, For, GridItem, Heading, HStack, ScrollArea, SimpleGrid, Textarea, VStack } from '@chakra-ui/react';
import React from 'react'

function ChatInterface(props) {
    const { userData } = props;

    const [currentChat, setCurrentChat] = React.useState(userData?.conversations ? userData.conversations[0] : null);
    const [newMessage, setNewMessage] = React.useState("");

    const chatBuilder = (conversations) => {
    // Handler for submitting a message
    const handleSendMessage = () => {
      if (!newMessage.trim()) return;


      console.log("Sending message: ", newMessage);
      currentChat?.messages.push({
        role: 'user',
        content: newMessage
      });
      setCurrentChat({...currentChat});
      // placeholder for sending message to backend
      setNewMessage("");
    };

    // Handler for key down in textarea
    const handleTextareaKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      }
    };

    return (
      <SimpleGrid
      columns={{ base: 6, md: "1fr 4fr" }}
      gap={{ base: "24px", md: "40px" }}
      width="100vw"
      height="100vh"
      minH="100vh"
      minW="100vw"
      position="fixed"
      top={0}
      left={0}
      px="10vw"
      py="10vh"
      >
      <GridItem colSpan={1} border="1px solid #ccc" borderRadius="md">
        <Container height="100%">
        <Heading size="lg" paddingTop={'1rem'} paddingBottom={'2rem'}>Conversations</Heading>
        <VStack>
          {conversations?.map((convo) => (
            <Button 
            variant="ghost"
            onClick={() => setCurrentChat(convo)}
            key={convo.id}
            isFullWidth
            textAlign="left"
            >
              {convo.title}
            </Button>
            ))}
        </VStack>
        </Container>
      </GridItem>
      <GridItem colSpan={5} border="1px solid #ccc" borderRadius="md">
        <Container height="100%">
          <Heading size="lg" paddingTop={'1rem'} paddingBottom={'2rem'}>Current Chat ({currentChat?.title})</Heading>
          {/* scroll area for messages */}
          <ScrollArea.Root height={"80%"}>
            <ScrollArea.Viewport>
            <ScrollArea.Content>
              {messageBuilder(currentChat?.messages)}
            </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar>
            <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Root>
          <HStack>
          <Textarea
            variant="outline"
            placeholder="Write a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
          />
          <Button mt={2} onClick={handleSendMessage} colorScheme="blue">
            Send
          </Button>
          </HStack>
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