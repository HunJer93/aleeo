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

# Run commands
run-backend:
	rails s

run-frontend:
	cd aleeo && npm run start
