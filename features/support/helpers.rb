# Helper methods for E2E tests
require 'rspec/expectations'

# Mock OpenAI client for testing
class MockOpenaiClient
  def self.mock_response
    "This is a test response from the AI assistant. Thank you for your message!"
  end

  def chat(messages)
    MockOpenaiClient.mock_response
  end
end

# Before each scenario, set up mocking and test data
Before do
  # Simple approach: Create a mock class and assign it to a constant
  mock_openai_class = Class.new do
    def chat(messages)
      MockOpenaiClient.mock_response
    end
  end

  # Remove existing constant if it exists and replace with mock
  if defined?(OpenaiClient)
    Object.send(:remove_const, :OpenaiClient)
  end
  Object.const_set(:OpenaiClient, mock_openai_class)

  # Clean up any existing test users to avoid conflicts, then create test user
  begin
    User.where(username: [ 'test@example.com', 'newuser@example.com' ]).destroy_all

    # Create a test user for sign-in scenarios
    User.create!(
      first_name: 'Test',
      last_name: 'User',
      username: 'test@example.com',
      password: 'testpassword123'
    )
  rescue => e
    puts "Note: Could not setup test users: #{e.message}"
  end
end

# Clean up after each scenario
After do |scenario|
  # Handle any alerts that might be open
  begin
    alert = page.driver.browser.switch_to.alert
    alert.accept if alert
  rescue Selenium::WebDriver::Error::NoSuchAlertError
    # No alert present, continue
  rescue => _e
    # Ignore other alert handling errors
  end

  # Clean up test data after each scenario
  begin
    User.where(username: [ 'test@example.com', 'newuser@example.com' ]).destroy_all
  rescue => _e
    # Ignore errors if database connection issues
  end
end

# Helper methods for common test actions
module TestHelpers
  def sign_in_user(email, password)
    visit 'http://localhost:3001'

    # Wait for the page to load
    expect(page).to have_button('Sign in', wait: 10)

    # Fill in sign in form
    fill_in 'Username', with: email
    fill_in 'Password', with: password

    # Handle any alerts that might appear before clicking
    begin
      alert = page.driver.browser.switch_to.alert
      alert.accept if alert
    rescue Selenium::WebDriver::Error::NoSuchAlertError
      # No alert present, continue
    rescue => _e
      # Ignore alert errors
    end

    click_button 'Sign in'

    # Handle any alerts that appear after clicking
    begin
      alert = page.driver.browser.switch_to.alert
      if alert
        alert.accept
        # If login failed, we may get redirected back to login page
        expect(page).to have_button('Sign in')
        return false # Indicate login failure
      end
    rescue Selenium::WebDriver::Error::NoSuchAlertError
      # No alert present, continue
    rescue => _e
      # Continue if no alert or alert handling fails
    end

    # Wait for successful login and redirect to chat interface
    expect(page).to have_content('Conversations', wait: 15)
    true # Indicate success
  end

  def create_new_account(first_name, last_name, email, password)
    visit 'http://localhost:3001'

    # Wait for the page to load
    expect(page).to have_button('Sign in', wait: 10)

    # Try to click Create Account link - it might be rendered as a clickable element
    begin
      click_link 'Create Account'
    rescue Capybara::ElementNotFound
      # If that fails, try find("a", text: "Create Account").click it
      find("a", text: "Create Account").click
    end

    # Wait for form to appear
    expect(page).to have_content('Create Account')

    # Fill in registration form
    fill_in 'First Name', with: first_name
    fill_in 'Last Name', with: last_name
    fill_in 'Email', with: email

    # Fill in password fields (need to be specific since there are two)
    password_fields = all('input[type="password"]')
    password_fields[0].set(password)  # Password field
    password_fields[1].set(password)  # Confirm password field

    click_button 'Create Account'

    # Handle any alerts that appear after clicking
    begin
      alert = page.driver.browser.switch_to.alert
      if alert
        alert.accept
        # If account creation failed alert appeared, return to indicate failure
        expect(page).to have_content('Create Account', wait: 5)
        return false
      end
    rescue Selenium::WebDriver::Error::NoSuchAlertError
      # No alert, continue normally
    rescue => _e
      # Continue if alert handling fails
    end

    # Wait for account creation and automatic sign in
    expect(page).to have_content('Conversations', wait: 15)
    true
  end

  def send_message(message_content)
    # Find message textarea and send message
    message_input = find('textarea[placeholder*="message"]', wait: 10)
    message_input.set(message_content)

    # Find and click send button
    click_button 'Send'

    # Wait for UI update
    sleep 2
  end

  def wait_for_ai_response
    # Wait for the spinner to disappear (indicates AI response received)
    expect(page).to have_no_content('Thinking...', wait: 15)
  end
end

World(TestHelpers)
