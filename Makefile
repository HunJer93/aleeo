setup:
	bundle install
	rails db:create db:migrate db:seed

test:
	bundle exec rspec

e2e-test:
	./bin/e2e_test

run-backend:
	rails s

run-frontend:
	cd aleeo && npm run start
