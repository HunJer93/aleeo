# Step definitions for user sign in feature

When('I sign in with valid credentials') do
  sign_in_user(@test_user.username, 'testpassword123')
end

Then('I should be successfully signed in') do
  # Check that we're now in the ChatInterface (has conversations sidebar)
  expect(page).to have_content('Conversations')

  # Check that we're not on the login page anymore
  expect(page).not_to have_button('Sign in')
end

Then('I should see my conversations list') do
  # Verify we can see conversations in the sidebar
  expect(page).to have_content('Conversations')

  # Check for our test conversation
  expect(page).to have_content('Test Conversation')
end
