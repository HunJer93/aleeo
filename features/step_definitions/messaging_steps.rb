# Step definitions for AI messaging feature

Given('I am signed in') do
  visit 'http://localhost:3001'
  sign_in_user(@test_user.username, 'password123')

  # Verify successful sign in
  expect(page).to have_content('Conversations')
end

Given('I am in a conversation') do
  # Click on the test conversation to open it
  click_on 'Test Conversation'

  # Verify we're in the chat interface with message input
  expect(page).to have_css('textarea[placeholder*="message"]')

  # Verify we can see the current chat title
  expect(page).to have_content('Current Chat (Test Conversation)')
end

When('I send a message {string}') do |message_content|
  send_message(message_content)
  @sent_message = message_content
end

Then('I should see my message in the conversation') do
  # Check that our message appears in the chat
  expect(page).to have_content(@sent_message)

  # Verify it's marked as a user message
  expect(page).to have_content("user: #{@sent_message}")
end

Then('I should receive an AI response') do
  # Wait for AI response to appear
  wait_for_ai_response
  expect(page).to have_content(MockOpenaiClient.mock_response, wait: 10)
end

Then('the AI response should be displayed in the conversation') do
  # Verify the AI response is properly displayed
  expect(page).to have_content(MockOpenaiClient.mock_response)

  # Verify it's marked as an assistant message
  expect(page).to have_content("assistant:")
end
