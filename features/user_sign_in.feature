@javascript
Feature: User Authentication and Sign In
  As a user
  I want to be able to sign into my existing account
  So that I can access my conversations

  Background:
    Given the Rails backend is running
    And the React frontend is running
    And I have an existing user account

  Scenario: User signs in and sees conversations list
    Given I am on the home page
    When I sign in with valid credentials
    Then I should be successfully signed in
    And I should see my conversations list