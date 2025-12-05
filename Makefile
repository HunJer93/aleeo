setup:
	make setup-frontend
	bundle install
	rails db:create db:migrate db:seed

setup-frontend:
	cd client && npm install

# Test commands

rspec:
	bundle exec rspec

cucumber:
	bundle exec cucumber features/

jest:
	cd client && npm test -- --watchAll=false --ci

e2e-test:
	./bin/e2e_test

# Integration test server management
start-test-servers:
	./bin/start_test_servers

stop-test-servers:
	./bin/stop_test_servers

# Run integration tests with proper server setup
integration-test: stop-test-servers start-test-servers
	@echo "Running integration tests..."
	@if [ "$$CI" = "true" ]; then \
		echo "CI Environment - checking server status before tests"; \
		curl -f http://localhost:3000/api/v1/users || echo "Rails server not responding"; \
	fi
	@if [ "$$CI" = "true" ]; then \
		bundle exec cucumber features/ || (./bin/stop_test_servers && exit 1); \
	else \
		echo "Running integration tests without coverage..."; \
		SKIP_COVERAGE=true bundle exec cucumber features/ || (./bin/stop_test_servers && exit 1); \
	fi
	./bin/stop_test_servers

# Run commands
run-backend:
	rails s

run-frontend:
	cd client && npm run start
