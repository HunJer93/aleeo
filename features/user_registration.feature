@javascript
Feature: User Account Creation
  As a new user
  I want to create a new account
  So that I can use the application and sign in

  Background:
    Given the Rails backend is running
    And the React frontend is running

  Scenario: New user account can be created and used for sign in
    Given I create a new account via API
    When I sign in with my new credentials
    Then I should be successfully signed in
    And I should see my conversations list