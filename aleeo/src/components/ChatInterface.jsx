import { Box, Button, Container, For, GridItem, Heading, HStack, IconButton, Popover, ScrollArea, Separator, SimpleGrid, Textarea, VStack } from '@chakra-ui/react';
import React from 'react'
import { FaPlusCircle } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { createConversation, createMessage, deleteConversation, renameConversation } from '../utility/apiUtils';

// ChatInterface component that accepts userData as a prop

// user data structure:
// userData = {
//   id: number,
//   username: string,
//   firstName: string,
//   lastName: string,
//   conversations: [
//     {
//       id: number,
//       title: string,
//       messages: [
//         {
//           id: number,
//           role: 'user' | 'assistant',
//           content: string,
//           conversationId: number
//         },
//         ...
//       ]
//     },
//     ...
//   ]
// }s

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

      const handleEditConversation = async (conversationId) => {
        const response = await renameConversation(conversationId, "Renamed Conversation Placeholder Title");

        console.log("Rename response: ", response);
        // update in userData.conversations
        const convo = userData.conversations.find((convo) => convo.id === conversationId);
        if (convo) {
          // update title from response
          convo.title = response?.title;
          // if renamed convo is currentChat, update currentChat
          if (currentChat.id === conversationId) {
            setCurrentChat({...currentChat, title: convo.title});
          } else {
            setCurrentChat({...currentChat});
          }
        }

      };

      const handleDeleteConversation = async (conversationId) => {
        await deleteConversation(conversationId);
        // remove from userData.conversations
        const index = userData.conversations.findIndex((convo) => convo.id === conversationId);
        if (index !== -1) {
          userData.conversations.splice(index, 1);
          // if deleted convo is currentChat, set currentChat to first convo or null
          if (currentChat.id === conversationId) {
            setCurrentChat(userData.conversations.length > 0 ? userData.conversations[0] : null);
          } else {
            setCurrentChat({...currentChat});
          }
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
        <GridItem colSpan={1} border="1px solid #ccc" borderRadius="md" className="conversations-title-column" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Container
            style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
            minHeight="3.5rem"
            justifyContent="flex-start"
            alignItems="stretch"
            p={0}
          >
          {/* conversations side bar */}
            <HStack
              alignItems="center"
              justifyContent="center"
              width="100%"
              paddingTop={'1rem'}
              paddingBottom={'1rem'}
              flexWrap="wrap"
              style={{ flexShrink: 0 }}
            >
              <Heading
                size="md"
                m={0}
                display="flex"
                alignItems="center"
                whiteSpace="normal" // <-- allow wrapping
                wordBreak="break-word" // <-- break long words
              >
                Conversations
              </Heading>
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
            <Box width="100%" display="flex" justifyContent="center" style={{ flexShrink: 0 }}>
              <Separator size={'lg'} width="80%" mx="auto" />
            </Box>
            <VStack paddingTop={'1rem'} width="100%" className='current-chat-window' style={{ flex: 1, minHeight: 0 }}>
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
                    <Box key={convo.id} width="100%" mb={5} py={3} px={1}>
                      <HStack width="100%" alignItems="center" justifyContent="space-between">
                        <Box flex="1 1 auto" minWidth={0}>
                          <Button
                            variant="ghost"
                            onClick={() => setCurrentChat(convo)}
                            key={convo.id}
                            textAlign="left"
                            whiteSpace="normal"
                            wordBreak="break-word"
                            width="100%"
                          >
                            {convo.title}
                          </Button>
                        </Box>
                        <Box flexShrink={0}>
                          <Popover.Root>
                            <Popover.Trigger>
                              <IconButton aria-label="conversation-options" variant="ghost" size="xs">
                                <HiDotsHorizontal />
                              </IconButton>
                            </Popover.Trigger>
                            <Popover.Content>
                              <VStack spacing={1}>
                                <Button variant="link" onClick={() => handleEditConversation(convo.id)}>Rename</Button>
                                <Button variant="link" onClick={() => handleDeleteConversation(convo.id)}>Delete</Button>
                              </VStack>
                            </Popover.Content>
                          </Popover.Root>
                        </Box>
                      </HStack>
                    </Box>
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
        <GridItem colSpan={5} border="1px solid #ccc" borderRadius="md" className="current-chat-window" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Container style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Heading size="lg" paddingTop={'1rem'} paddingBottom={'2rem'} style={{ flexShrink: 0 }}>Current Chat ({currentChat?.title})</Heading>
            {/* scroll area for messages */}
            <ScrollArea.Root style={{ flex: 1, minHeight: 0 }}>
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
            <HStack style={{ flexShrink: 0 }}>
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