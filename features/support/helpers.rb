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

    # Wait for the page to load with better error handling
    begin
      expect(page).to have_button('Sign in', wait: 15)
    rescue RSpec::Expectations::ExpectationNotMetError => e
      puts "Sign in page failed to load. Current URL: #{page.current_url}"
      puts "Page title: #{page.title rescue 'Unable to get title'}"
      puts "Page body contains: #{page.body[0..500] rescue 'Unable to get body'}"
      raise e
    end

    # Fill in sign in form using placeholders (not labels)
    find('input[placeholder="Username"]').set(email)
    find('input[placeholder="Password"]').set(password)

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
      sleep(1) # Give time for potential alert to appear
      alert = page.driver.browser.switch_to.alert
      if alert
        alert_text = alert.text
        puts "Alert appeared during sign-in: #{alert_text}"
        alert.accept
        # If login failed, return failure
        return false
      end
    rescue Selenium::WebDriver::Error::NoSuchAlertError
      # No alert present - this is good, continue normally
    rescue => e
      puts "Alert handling error during sign-in: #{e.message}"
      # Continue if alert handling fails
    end

    # Wait for successful login and redirect to chat interface
    begin
      expect(page).to have_content('Conversations', wait: 20)
    rescue RSpec::Expectations::ExpectationNotMetError => e
      puts "Login failed or conversations not found. Current URL: #{page.current_url}"
      puts "Page body contains: #{page.body[0..500] rescue 'Unable to get body'}"
      raise e
    end

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

    # Fill in registration form using placeholders
    find('input[placeholder="First name"]').set(first_name)
    find('input[placeholder="Last Name"]').set(last_name)
    find('input[placeholder="Email"]').set(email)

    # Fill in password fields safely
    password_fields = all('input[type="password"]')
    if password_fields.length >= 2
      password_fields[0].set(password)  # Password field
      password_fields[1].set(password)  # Confirm password field
    else
      raise "Expected 2 password fields, found #{password_fields.length}"
    end

    click_button 'Create Account'

    # Handle any alerts that appear after clicking
    begin
      sleep(1) # Give time for potential alert to appear
      alert = page.driver.browser.switch_to.alert
      if alert
        alert_text = alert.text
        puts "Alert appeared during registration: #{alert_text}"
        alert.accept
        # If account creation failed, return failure
        return false
      end
    rescue Selenium::WebDriver::Error::NoSuchAlertError
      # No alert present - this is good, continue normally
    rescue => e
      puts "Alert handling error: #{e.message}"
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
