# E2E Testing with Cucumber

This project includes end-to-end (E2E) tests using Cucumber, Capybara, and Selenium WebDriver to test the full user journey through the web application.

## Test Scenarios

The E2E test suite covers these three main scenarios:

### 1. User Sign In (`features/user_sign_in.feature`)
- Tests that existing users can sign into their accounts
- Verifies the conversations list is displayed after sign in

### 2. User Registration (`features/user_registration.feature`)  
- Tests that new users can create accounts
- Verifies successful account creation and automatic sign in

### 3. AI Messaging (`features/ai_messaging.feature`)
- Tests that signed-in users can send messages and receive AI responses
- Uses mocked OpenAI responses for consistent testing

## Dependencies

The following gems have been added for E2E testing:

```ruby
group :test do
  gem "cucumber-rails", "~> 3.0", require: false
  gem "selenium-webdriver", "~> 4.0"
  gem "webdrivers", "~> 5.0"
  gem "capybara", "~> 3.39"
  gem "rspec-expectations", "~> 3.12"
end
```

## Setup

1. Install dependencies:
```bash
bundle install
```

2. Set up the test database:
```bash
rails db:test:prepare
```

## Running E2E Tests

### Option 1: Run with servers already running (Recommended for development)

Start your servers in separate terminals:

```bash
# Terminal 1: Start Rails backend
rails s

# Terminal 2: Start React frontend
cd aleeo && npm start
```

Then run the tests:
```bash
./bin/e2e_test_simple
```

### Option 2: Run with automatic server management

This will start and stop servers automatically:
```bash
./bin/e2e_test
```

### Option 3: Run manually with Cucumber

```bash
bundle exec cucumber -p e2e
```

## Test Configuration

- Tests run in **headless Chrome** by default for CI/CD compatibility
- OpenAI API calls are **mocked** to return predictable responses
- Database is cleaned between test scenarios using `database_cleaner`
- React frontend runs on port 3001, Rails backend on port 3000

## Test Structure

```
features/
├── step_definitions/
│   ├── background_steps.rb      # Common setup steps
│   ├── sign_in_steps.rb         # Sign-in related steps
│   ├── registration_steps.rb    # User registration steps
│   └── messaging_steps.rb       # AI messaging steps
├── support/
│   ├── env.rb                   # Cucumber environment config
│   └── helpers.rb               # Test helper methods
├── user_sign_in.feature         # Sign-in test scenarios
├── user_registration.feature    # Registration test scenarios
└── ai_messaging.feature         # Messaging test scenarios
```

## Mocking

The tests use a `MockOpenaiClient` that returns a consistent test response instead of calling the actual OpenAI API. This ensures:
- Tests run reliably without external API dependencies
- No API costs during testing
- Predictable, testable responses

## Makefile Commands

```bash
make setup          # Install dependencies and set up database
make test           # Run RSpec unit tests  
make e2e-test       # Run E2E tests (assuming servers are running)
make run-backend    # Start Rails server
make run-frontend   # Start React server
```

## Troubleshooting

### Chrome/ChromeDriver Issues
If you encounter Chrome or ChromeDriver issues, make sure you have Chrome installed and try updating the webdrivers gem:
```bash
bundle update webdrivers
```

### Server Connection Issues
- Ensure Rails server is running on port 3000: `rails s`
- Ensure React server is running on port 3001: `cd aleeo && npm start`
- Check that the `.env` file in the `aleeo` directory has: `REACT_APP_URL=http://localhost:3000/api/v1`

### Test Database Issues
Reset the test database if needed:
```bash
rails db:test:drop db:test:create db:test:migrate
```