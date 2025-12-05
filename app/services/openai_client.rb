require "httparty"
# client to interact with OpenAI API
# response returns in this format
# {
#   "id": "chatcmpl-123",
#   "object": "chat.completion",
#   "created": 1677652288,
#   "model": "gpt-4o-mini",
#   "choices": [
#     {
#       "index": 0,
#       "message": {
#         "role": "assistant",
#         "content": "\n\nHello! How can I assist you today?",
#         "refusal": null,
#         "annotations": []
#       },
#       "logprobs": null,
#       "finish_reason": "stop"
#     }
#   ],
#   "usage": {
#     "prompt_tokens": 9,
#     "completion_tokens": 12,
#     "total_tokens": 21,
#     "prompt_tokens_details": {
#       "cached_tokens": 0,
#       "audio_tokens": 0
#     },
#     "completion_tokens_details": {
#       "reasoning_tokens": 0,
#       "audio_tokens": 0,
#       "accepted_predictions_tokens": 0,
#       "rejected_predictions_tokens": 0
#     }
#   },
#   "service_tier": "default",
#   "system_fingerprint": "abc123"
# }
# The assistant's message content can be found at response["choices"][0]["message"]["content"]
# Refer to OpenAI API documentation for more details: https://platform.openai.com/docs/api-reference/chat/create

class OpenaiClient
  include HTTParty
  BASE_URL = "https://api.openai.com/v1".freeze

  def initialize
    @api_key = ENV["OPENAI_API_KEY"] || Rails.application.credentials.dig(:openai, :api_key)
  end


  def chat(messages)
    begin
      response = HTTParty.post(
            "#{BASE_URL}/chat/completions",
            headers: headers,
            body: {
              model: "gpt-4o-mini",
              messages: messages
            }.to_json
          )
      if response.code == 200
        unpack_message_response(response)
      end

    rescue => e
      Rails.logger.error("OpenAI API error: #{e.message}")
      "Sorry, I'm having trouble responding right now."
    end
  end

  private

  def headers
    {
      "Content-Type" => "application/json",
      "Authorization" => "Bearer #{@api_key}"
    }
  end

  def unpack_message_response(response)
    parsed = JSON.parse(response.body) rescue nil

    unless parsed.is_a?(Hash) && parsed["choices"].is_a?(Array) && parsed["choices"].any?
      raise "Unexpected response format: missing or invalid 'choices' field"
    end
    message = parsed["choices"][0]["message"] rescue nil

    unless message.is_a?(Hash) && message.key?("content")
      raise "Unexpected response format: missing or invalid 'message' or 'content' key"
    end

    message["content"]
  end
end
