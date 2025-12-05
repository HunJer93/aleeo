# Integration Test Fixes - Cucumber ERR_CONNECTION_REFUSED

## Problem Solved ✅

The Cucumber integration tests were failing in CI with:
```
unknown error: net::ERR_CONNECTION_REFUSED (Selenium::WebDriver::Error::UnknownError)
```

This occurred because the tests were trying to access:
- `http://localhost:3001` (React frontend)
- `http://localhost:3000` (Rails backend)

But neither server was running in the CI environment.

## Root Cause

Integration tests require **both** the Rails API server and React development server to be running simultaneously:
- **Rails server** - Provides the API endpoints the React app calls
- **React server** - Serves the frontend application that Selenium interacts with

In local development, developers typically start these manually. In CI, this wasn't happening.

## Solution Implemented

### 1. Updated CI Configuration

**`.github/workflows/ci.yml` and `.github/workflows/deploy.yml`:**
- Added step to start Rails server in test mode on port 3000
- Added step to start React dev server on port 3001  
- Added health checks to verify both servers are accessible
- Set proper environment variables (`REACT_APP_URL`, etc.)

```yaml
- name: Start Rails backend server
  env:
    RAILS_ENV: test
  run: |
    bundle exec rails server -p 3000 -d
    sleep 5

- name: Start React frontend server
  working-directory: ./aleeo
  run: |
    npm start &
    timeout 60 bash -c 'until curl -s http://localhost:3001 > /dev/null; do sleep 2; done'
  env:
    CI: false
    PORT: 3001
```

### 2. Enhanced Step Definitions

**Updated step files to verify servers before proceeding:**
- `features/step_definitions/background_steps.rb` - Added server health checks
- `features/step_definitions/messaging_steps.rb` - Added server verification
- `features/step_definitions/registration_steps.rb` - Added server verification

### 3. Local Development Tools

**Created helper scripts for local testing:**
- `bin/start_test_servers` - Starts both servers with health checks
- `bin/stop_test_servers` - Cleanly stops all test servers
- `make integration-test` - Complete workflow with server management

### 4. Improved Error Handling

**Enhanced `features/support/helpers.rb`:**
- Better error messages when servers are unreachable
- More robust wait conditions for page loads
- Detailed logging for debugging CI failures

### 5. Capybara Configuration

**Updated `features/support/env.rb`:**
- Increased timeout for CI environments
- Disabled automatic reload for stability
- Optimized Chrome options for headless CI execution

## Usage

### In CI (Automatic)
The integration tests now work automatically in GitHub Actions CI.

### Local Development
```bash
# Start both servers and run integration tests
make integration-test

# Or manually:
./bin/start_test_servers
bundle exec cucumber
./bin/stop_test_servers
```

### Debugging Failed Tests
The enhanced error handling now provides:
- Current page URL when failures occur
- Page content snippets for diagnosis  
- Server connectivity status
- Clear error messages for missing components

## Test Status

- ✅ **ai_messaging.feature** - Can test messaging with both servers running
- ✅ **user_registration.feature** - Can test sign-up flow end-to-end  
- ✅ **user_sign_in.feature** - Can test authentication flow

## Technical Notes

### Why Both Servers Are Needed
1. **React Dev Server** - Selenium WebDriver interacts with the UI
2. **Rails API Server** - React app makes AJAX calls to fetch/post data
3. **Database** - Rails server queries test database for user data

### CI Environment Considerations
- Uses headless Chrome for browser automation
- Servers run in background during test execution
- Environment variables ensure proper API connectivity
- Health checks prevent race conditions during startup

### Future Improvements
- [ ] Consider using Docker Compose for server orchestration
- [ ] Add retry logic for flaky network connections
- [ ] Implement parallel test execution with port management
- [ ] Add performance monitoring for test execution times