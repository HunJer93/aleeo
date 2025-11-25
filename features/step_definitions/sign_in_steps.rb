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
  # Verify we can see the conversations section and are authenticated
  expect(page).to have_content('Conversations')
  expect(page).to have_button('Logout') # Indicates we're authenticated
  expect(page).to have_content('Current Chat') # Indicates we're in the chat interface
end
