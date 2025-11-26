setup:
	bundle install
	rails db:create db:migrate db:seed

# Test commands

rspec:
	bundle exec rspec

cucumber:
	bundle exec cucumber features/

jest:
	cd aleeo && npm test -- --watchAll=false --ci

e2e-test:
	./bin/e2e_test

# Integration test server management
start-test-servers:
	./bin/start_test_servers

stop-test-servers:
	./bin/stop_test_servers

# Run integration tests with proper server setup
integration-test: stop-test-servers start-test-servers
	bundle exec cucumber features/
	./bin/stop_test_servers

# Run commands
run-backend:
	rails s

run-frontend:
	cd aleeo && npm run start
