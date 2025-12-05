class Message < ApplicationRecord
  belongs_to :conversation
  validates :role, inclusion: { in: %w[user assistant] }

  # Format message for OpenAI API
  # OpenAI accepts an array of messages in the format:
  # [{ role: "user" or "assistant", content: "message content" }, ...]
  def format_for_openai
    { role: role, content: content }
  end
end
