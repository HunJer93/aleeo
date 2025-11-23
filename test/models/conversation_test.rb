require "test_helper"

class ConversationTest < ActiveSupport::TestCase
  should belong_to(:user)
  should have_many(:messages).dependent(:destroy)
end
