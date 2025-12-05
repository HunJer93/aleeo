@javascript
Feature: AI Chat Messaging
  As a signed-in user
  I want to send messages and receive AI responses
  So that I can have conversations with the AI assistant

  Background:
    Given the Rails backend is running
    And the React frontend is running
    And I have an existing user account
    And I am signed in

  Scenario: User sends message and receives AI response
    Given I am in a conversation
    When I send a message "Hello, how are you?"
    Then I should see my message in the conversation
    And I should receive an AI response
    And the AI response should be displayed in the conversation