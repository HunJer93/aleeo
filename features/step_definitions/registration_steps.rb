# Step definitions for user registration feature

When('I create a new account with valid information') do
  @new_user_data = {
    first_name: 'New',
    last_name: 'User',
    email: 'newuser@example.com',
    password: 'newpassword123'
  }

  create_new_account(
    @new_user_data[:first_name],
    @new_user_data[:last_name],
    @new_user_data[:email],
    @new_user_data[:password]
  )
end

Then('my account should be created successfully') do
  # Check that the user was created in the database
  new_user = User.find_by(username: @new_user_data[:email])
  expect(new_user).not_to be_nil
  expect(new_user.first_name).to eq(@new_user_data[:first_name])
  expect(new_user.last_name).to eq(@new_user_data[:last_name])
end

Then('I should be able to sign in with my new credentials') do
  # After account creation, user should be automatically signed in
  # Check that we're in the ChatInterface
  expect(page).to have_content('Conversations')
  expect(page).not_to have_button('Sign in')
end
