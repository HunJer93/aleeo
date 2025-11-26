# Step definitions for AI messaging feature

Given('I am signed in') do
  # Verify servers are running before attempting to visit
  step 'the React frontend is running'
  step 'the Rails backend is running'

  # Ensure we have the test user available
  @test_user = User.find_by(username: 'test@example.com')
  if @test_user.nil?
    puts "Test user not found during sign in, creating..."
    @test_user = User.create!(
      first_name: 'Test',
      last_name: 'User',
      username: 'test@example.com',
      password: 'testpassword123'
    )
  end

  visit 'http://localhost:3001'
  sign_in_user(@test_user.username, 'testpassword123')

  # Verify successful sign in
  expect(page).to have_content('Conversations')
end

Given('I am in a conversation') do
  # Since conversations aren't loading from the backend, we need to create a new one
  # Click the + button to create a new conversation
  find('[aria-label="add-conversation"]').click

  # Wait for the conversation to be created and the chat interface to be ready
  expect(page).to have_content('Current Chat (New Conversation', wait: 10)

  # Verify we have a message input field
  expect(page).to have_css('textarea[placeholder*="message"]')
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
  # Wait for AI response to appear - check for assistant message
  expect(page).to have_content("assistant:", wait: 15)
  # Verify it's not just the loading state
  expect(page).to have_no_content('Thinking...', wait: 5)
end

Then('the AI response should be displayed in the conversation') do
  # Verify the AI response is properly displayed with assistant label
  expect(page).to have_content("assistant:")

  # Verify there's some response content (not just the label)
  assistant_content = page.text
  expect(assistant_content).to match(/assistant:\s*\w+/) # Should have assistant: followed by some word content
end
