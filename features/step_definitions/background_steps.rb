# Background steps for setting up test environment

Given('the Rails backend is running') do
  # Check if Rails server is running on port 3000 in test mode
  begin
    require 'net/http'
    uri = URI('http://localhost:3000/api/v1/users')
    response = Net::HTTP.get_response(uri)
    puts "Rails backend is running (status: #{response.code})"
  rescue => e
    puts "Rails backend connection failed: #{e.message}"
    # In CI, the server should already be started, so this is an error
    raise "Rails backend is not accessible at http://localhost:3000" if ENV['CI']

    # Start Rails server in test mode if not running (local development only)
    puts "Starting Rails server in test mode..."
    system("cd #{Rails.root} && RAILS_ENV=test rails server -p 3000 -d")
    sleep 5 # Give server time to start
  end
end

Given('the React frontend is running') do
  # Check if React dev server is running on port 3001
  begin
    require 'net/http'
    uri = URI('http://localhost:3001')
    response = Net::HTTP.get_response(uri)
    puts "React frontend is running (status: #{response.code})"
  rescue => e
    puts "React frontend connection failed: #{e.message}"
    # In CI, the server should already be started, so this is an error
    raise "React frontend is not accessible at http://localhost:3001" if ENV['CI']

    puts "Note: React frontend should be running on port 3001 for integration tests"
  end
end

Given('I have an existing user account') do
  # The test user should be created in the Before hook in helpers.rb
  # This step just verifies it exists and assigns it to @test_user
  @test_user = User.find_by(username: 'test@example.com')
  if @test_user.nil?
    puts "Test user not found, creating..."
    @test_user = User.create!(
      first_name: 'Test',
      last_name: 'User',
      username: 'test@example.com',
      password: 'testpassword123'
    )
  end
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
