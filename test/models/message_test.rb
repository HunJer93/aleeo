require "test_helper"

class MessageTest < ActiveSupport::TestCase
  should belong_to(:conversation)
  should validate_inclusion_of(:role).in_array(%w[user assistant])

  test "format_for_openai returns correct hash" do
    message = messages(:one) # assuming you have fixtures
    formatted = message.format_for_openai

    assert_equal message.role, formatted[:role]
    assert_equal message.content, formatted[:content]
  end
end
