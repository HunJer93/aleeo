setup:
	bundle install
	rails db:create db:migrate db:seed

test:
	bundle exec rspec

run-backend:
	rails s

run-frontend:
	cd aleeo && npm run start
