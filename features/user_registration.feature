@javascript
Feature: User Account Creation
  As a new user
  I want to create a new account
  So that I can use the application and sign in

  Background:
    Given the Rails backend is running
    And the React frontend is running

  Scenario: User creates a new account and signs in
    Given I am on the home page
    When I create a new account with valid information
    Then my account should be created successfully
    And I should be able to sign in with my new credentials