# Step definitions for user registration feature

Given('I create a new account via API') do
  @new_user_data = {
    first_name: 'New',
    last_name: 'User',
    username: 'newuser@example.com',
    password: 'newpassword123'
  }

  # Create user via direct API call to test the backend
  @new_user = User.create!(
    first_name: @new_user_data[:first_name],
    last_name: @new_user_data[:last_name],
    username: @new_user_data[:username],
    password: @new_user_data[:password]
  )

  expect(@new_user.persisted?).to be true
end

When('I sign in with my new credentials') do
  # Verify servers are running before attempting to visit
  step 'the React frontend is running'
  step 'the Rails backend is running'

  visit 'http://localhost:3001'

  # Wait for the page to load
  expect(page).to have_button('Sign in', wait: 10)

  # Sign in with the new user credentials
  sign_in_user(@new_user_data[:username], @new_user_data[:password])
end
