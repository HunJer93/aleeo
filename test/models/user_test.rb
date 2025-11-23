require "test_helper"

class UserTest < ActiveSupport::TestCase
  should validate_presence_of(:username)
  should validate_uniqueness_of(:username)
  should validate_presence_of(:password)
  should have_secure_password
  should have_secure_password(:recovery_password)
  should have_many(:conversations).dependent(:destroy)
end
