# Background steps for setting up test environment

Given('the Rails backend is running') do
  # Check if Rails server is running on port 3000 in test mode
  begin
    require 'net/http'
    uri = URI('http://localhost:3000/api/v1/users')
    _response = Net::HTTP.get_response(uri)
    puts "Rails backend is already running"
  rescue => _e
    # Start Rails server in test mode if not running
    puts "Starting Rails server in test mode..."
    system("cd /home/jhunton22/github/aleeo && RAILS_ENV=test rails server -p 3000 -d")
    sleep 5 # Give server time to start
  end
end

Given('the React frontend is running') do
  # Check if React dev server is running on port 3001
  begin
    require 'net/http'
    uri = URI('http://localhost:3001')
    _response = Net::HTTP.get_response(uri)
    puts "React frontend is already running"
  rescue => _e
    puts "Note: React frontend should be running on port 3001"
    # In practice, the React dev server should be started separately
    # as it takes time to compile and we don't want to wait for it in each test
  end
end

Given('I have an existing user account') do
  # The test user is now created in the Before hook in helpers.rb
  # This step just verifies it exists
  @test_user = User.find_by(username: 'test@example.com')
  expect(@test_user).to be_present

  # Create a test conversation for the user
  @test_conversation = Conversation.create!(
    user: @test_user,
    title: 'Test Conversation'
  )

  # Add a message to the conversation
  Message.create!(
    conversation: @test_conversation,
    role: 'user',
    content: 'Hello, this is a test message'
  )
end

Given('I am on the home page') do
  visit 'http://localhost:3001'

  # Wait for the page to load and verify we're on the login page
  expect(page).to have_button('Sign in', wait: 10)
end
