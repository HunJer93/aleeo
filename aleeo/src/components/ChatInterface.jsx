import { Box, Button, Container, For, GridItem, Heading, HStack, IconButton, ScrollArea, Separator, SimpleGrid, Textarea, VStack } from '@chakra-ui/react';
import React from 'react'
import { FaPlusCircle } from "react-icons/fa";
import { createConversation, createMessage } from '../utility/apiUtils';

function ChatInterface(props) {
    const { userData } = props;

    const [currentChat, setCurrentChat] = React.useState(userData?.conversations ? userData.conversations[0] : null);
    const [newMessage, setNewMessage] = React.useState("");

    const chatBuilder = (conversations) => {
    // Handler for adding a new conversation
    const handleAddConversation = async () => {
      // Generate a new conversation object
      const newCovoTitle =  `New Conversation ${conversations.length + 1}`;
      // Add to userData.conversations
      if (userData && userData.conversations) {
      // post request to create new conversation
        const newConvo = await createConversation({ user_id: userData.id, title: newCovoTitle });
        if (newConvo) {
          userData.conversations.push(newConvo);
          setCurrentChat(newConvo);
        }
        
      }
    };


    // Handler for submitting a message
    const handleSendMessage = async () => {
      if (!newMessage.trim()) return;
      // send message via API
      const responseMessage = await createMessage({ role: 'user', content: newMessage, conversation_id: currentChat.id });

      // load response into chat
      if (responseMessage) {
        currentChat?.messages.push(responseMessage);
        setCurrentChat({...currentChat});
        // wipe new message area
        setNewMessage("");
      }
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
        <Container
          height="100%"
          minHeight="3.5rem"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="stretch"
          p={0}
        >
          <HStack
            alignItems="center"
            justifyContent="center"
            width="100%"
            paddingTop={'1rem'}
            paddingBottom={'1rem'}
          >
            <Heading size="md" m={0} display="flex" alignItems="center" whiteSpace="nowrap">Conversations</Heading>
            <IconButton
              aria-label="add-conversation"
              rounded="full"
              size={"2xs"}
              colorPalette={"purple"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={1}
              onClick={handleAddConversation}
            >
              <FaPlusCircle />
            </IconButton>
          </HStack>
          <Box width="100%" display="flex" justifyContent="center">
            <Separator size={'lg'} width="80%" mx="auto" />
          </Box>
          <VStack paddingTop={'1rem'} width="100%">
          {/* scroll area for chats */}
          <ScrollArea.Root height={"55rem"}>
            <ScrollArea.Viewport
              css={{
                "--scroll-shadow-size": "4rem",
                maskImage:
                  "linear-gradient(#000,#000,transparent 0,#000 var(--scroll-shadow-size),#000 calc(100% - var(--scroll-shadow-size)),transparent)",
                "&[data-at-top]": {
                  maskImage:
                    "linear-gradient(180deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
                },
                "&[data-at-bottom]": {
                  maskImage:
                    "linear-gradient(0deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
                },
              }}
            >
            <ScrollArea.Content>
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
            </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar>
            <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Root>

          </VStack>
        </Container>
      </GridItem>
      <GridItem colSpan={5} border="1px solid #ccc" borderRadius="md">
        <Container height="100%">
          <Heading size="lg" paddingTop={'1rem'} paddingBottom={'2rem'}>Current Chat ({currentChat?.title})</Heading>
          {/* scroll area for messages */}
          <ScrollArea.Root height={"55rem"}>
            <ScrollArea.Viewport
              css={{
                "--scroll-shadow-size": "4rem",
                maskImage:
                  "linear-gradient(#000,#000,transparent 0,#000 var(--scroll-shadow-size),#000 calc(100% - var(--scroll-shadow-size)),transparent)",
                "&[data-at-top]": {
                  maskImage:
                    "linear-gradient(180deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
                },
                "&[data-at-bottom]": {
                  maskImage:
                    "linear-gradient(0deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
                },
              }}
            >
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
    {/* {console.log("User Data in Chat Interface: ", JSON.stringify(userData, 1, 1))} */}
    </div>
    
  )
}

export default ChatInterface