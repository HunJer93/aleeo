require 'rails_helper'

RSpec.describe OpenaiClient do
  let(:openai_client) { described_class.new }
  let(:messages) do
    [
      { role: 'user', content: 'Hello, how are you?' }
    ]
  end

  before do
    # Mock the API key
    allow(Rails.application.credentials).to receive(:dig).with(:openai, :api_key).and_return('test-api-key')
    ENV['OPENAI_API_KEY'] = 'test-api-key'
  end

  describe '#initialize' do
    context 'when API key is in credentials' do
      it 'sets the API key from Rails credentials' do
        allow(Rails.application.credentials).to receive(:dig).with(:openai, :api_key).and_return('credentials-key')
        ENV['OPENAI_API_KEY'] = nil

        client = described_class.new
        expect(client.instance_variable_get(:@api_key)).to eq('credentials-key')
      end
    end

    context 'when API key is in ENV' do
      it 'uses the ENV API key' do
        ENV['OPENAI_API_KEY'] = 'env-key'

        client = described_class.new
        expect(client.instance_variable_get(:@api_key)).to eq('env-key')
      end
    end
  end

  describe '#chat' do
    let(:successful_response_body) do
      {
        "id" => "chatcmpl-123",
        "object" => "chat.completion",
        "created" => 1677652288,
        "model" => "gpt-4o-mini",
        "choices" => [
          {
            "index" => 0,
            "message" => {
              "role" => "assistant",
              "content" => "Hello! How can I assist you today?",
              "refusal" => nil
            },
            "finish_reason" => "stop"
          }
        ]
      }.to_json
    end

    let(:successful_response) do
      double('HTTParty::Response', code: 200, body: successful_response_body)
    end

    before do
      allow(HTTParty).to receive(:post).and_return(successful_response)
    end

    context 'happy path' do
      it 'makes a request to OpenAI API with correct parameters' do
        openai_client.chat(messages)

        expect(HTTParty).to have_received(:post).with(
          "https://api.openai.com/v1/chat/completions",
          headers: {
            "Content-Type" => "application/json",
            "Authorization" => "Bearer test-api-key"
          },
          body: {
            model: "gpt-4o-mini",
            messages: messages
          }.to_json
        )
      end

      it 'returns the assistant message content' do
        result = openai_client.chat(messages)
        expect(result).to eq("Hello! How can I assist you today?")
      end

      it 'successfully processes the response' do
        result = openai_client.chat(messages)
        expect(result).to be_a(String)
        expect(result).not_to be_empty
      end
    end

    context 'API response error codes' do
      context 'when API returns non-200 status code' do
        let(:error_response) { double('HTTParty::Response', code: 500, body: '{"error": "Internal server error"}') }

        before do
          allow(HTTParty).to receive(:post).and_return(error_response)
        end

        it 'returns nil for non-200 response' do
          result = openai_client.chat(messages)
          expect(result).to be_nil
        end
      end

      context 'when API returns 401 unauthorized' do
        let(:unauthorized_response) { double('HTTParty::Response', code: 401, body: '{"error": "Unauthorized"}') }

        before do
          allow(HTTParty).to receive(:post).and_return(unauthorized_response)
        end

        it 'returns nil for unauthorized response' do
          result = openai_client.chat(messages)
          expect(result).to be_nil
        end
      end

      context 'when API returns 429 rate limit' do
        let(:rate_limit_response) { double('HTTParty::Response', code: 429, body: '{"error": "Rate limit exceeded"}') }

        before do
          allow(HTTParty).to receive(:post).and_return(rate_limit_response)
        end

        it 'returns nil for rate limit response' do
          result = openai_client.chat(messages)
          expect(result).to be_nil
        end
      end
    end

    context 'malformed response payload edge cases' do
      context 'when response body is not valid JSON' do
        let(:invalid_json_response) do
          double('HTTParty::Response', code: 200, body: 'invalid json')
        end

        before do
          allow(HTTParty).to receive(:post).and_return(invalid_json_response)
          allow(Rails.logger).to receive(:error)
        end

        it 'catches JSON parse error and returns fallback message' do
          result = openai_client.chat(messages)
          expect(result).to eq("Sorry, I'm having trouble responding right now.")
        end

        it 'logs the error' do
          openai_client.chat(messages)
          expect(Rails.logger).to have_received(:error).with(/OpenAI API error:/)
        end
      end

      context 'when response is valid JSON but missing choices field' do
        let(:missing_choices_response) do
          double('HTTParty::Response', code: 200, body: '{"id": "test"}')
        end

        before do
          allow(HTTParty).to receive(:post).and_return(missing_choices_response)
          allow(Rails.logger).to receive(:error)
        end

        it 'catches format error and returns fallback message' do
          result = openai_client.chat(messages)
          expect(result).to eq("Sorry, I'm having trouble responding right now.")
        end

        it 'logs the specific error' do
          openai_client.chat(messages)
          expect(Rails.logger).to have_received(:error).with(/missing or invalid 'choices' field/)
        end
      end

      context 'when choices field is not an array' do
        let(:invalid_choices_response) do
          double('HTTParty::Response', code: 200, body: '{"choices": "not an array"}')
        end

        before do
          allow(HTTParty).to receive(:post).and_return(invalid_choices_response)
          allow(Rails.logger).to receive(:error)
        end

        it 'catches format error and returns fallback message' do
          result = openai_client.chat(messages)
          expect(result).to eq("Sorry, I'm having trouble responding right now.")
        end
      end

      context 'when choices array is empty' do
        let(:empty_choices_response) do
          double('HTTParty::Response', code: 200, body: '{"choices": []}')
        end

        before do
          allow(HTTParty).to receive(:post).and_return(empty_choices_response)
          allow(Rails.logger).to receive(:error)
        end

        it 'catches format error and returns fallback message' do
          result = openai_client.chat(messages)
          expect(result).to eq("Sorry, I'm having trouble responding right now.")
        end
      end

      context 'when first choice is missing message field' do
        let(:missing_message_response) do
          double('HTTParty::Response', code: 200, body: '{"choices": [{"index": 0}]}')
        end

        before do
          allow(HTTParty).to receive(:post).and_return(missing_message_response)
          allow(Rails.logger).to receive(:error)
        end

        it 'catches format error and returns fallback message' do
          result = openai_client.chat(messages)
          expect(result).to eq("Sorry, I'm having trouble responding right now.")
        end

        it 'logs the specific error' do
          openai_client.chat(messages)
          expect(Rails.logger).to have_received(:error).with(/missing or invalid 'message' or 'content' key/)
        end
      end

      context 'when message field is not a hash' do
        let(:invalid_message_response) do
          double('HTTParty::Response', code: 200, body: '{"choices": [{"message": "not a hash"}]}')
        end

        before do
          allow(HTTParty).to receive(:post).and_return(invalid_message_response)
          allow(Rails.logger).to receive(:error)
        end

        it 'catches format error and returns fallback message' do
          result = openai_client.chat(messages)
          expect(result).to eq("Sorry, I'm having trouble responding right now.")
        end
      end

      context 'when message is missing content key' do
        let(:missing_content_response) do
          double('HTTParty::Response', code: 200, body: '{"choices": [{"message": {"role": "assistant"}}]}')
        end

        before do
          allow(HTTParty).to receive(:post).and_return(missing_content_response)
          allow(Rails.logger).to receive(:error)
        end

        it 'catches format error and returns fallback message' do
          result = openai_client.chat(messages)
          expect(result).to eq("Sorry, I'm having trouble responding right now.")
        end
      end

      context 'when content is nil' do
        let(:nil_content_response) do
          double('HTTParty::Response', code: 200, body: '{"choices": [{"message": {"role": "assistant", "content": null}}]}')
        end

        before do
          allow(HTTParty).to receive(:post).and_return(nil_content_response)
        end

        it 'returns nil content successfully' do
          result = openai_client.chat(messages)
          expect(result).to be_nil
        end
      end

      context 'when content is empty string' do
        let(:empty_content_response) do
          double('HTTParty::Response', code: 200, body: '{"choices": [{"message": {"role": "assistant", "content": ""}}]}')
        end

        before do
          allow(HTTParty).to receive(:post).and_return(empty_content_response)
        end

        it 'returns empty string successfully' do
          result = openai_client.chat(messages)
          expect(result).to eq("")
        end
      end
    end

    context 'network and connection errors' do
      context 'when HTTParty raises a network error' do
        before do
          allow(HTTParty).to receive(:post).and_raise(Net::ReadTimeout, 'Request timeout')
          allow(Rails.logger).to receive(:error)
        end

        it 'catches the error and returns fallback message' do
          result = openai_client.chat(messages)
          expect(result).to eq("Sorry, I'm having trouble responding right now.")
        end

        it 'logs the network error' do
          openai_client.chat(messages)
          expect(Rails.logger).to have_received(:error).with(/OpenAI API error: Net::ReadTimeout/)
        end
      end

      context 'when HTTParty raises a connection error' do
        before do
          allow(HTTParty).to receive(:post).and_raise(Errno::ECONNREFUSED, 'Connection refused')
          allow(Rails.logger).to receive(:error)
        end

        it 'catches the error and returns fallback message' do
          result = openai_client.chat(messages)
          expect(result).to eq("Sorry, I'm having trouble responding right now.")
        end
      end

      context 'when HTTParty raises an SSL error' do
        before do
          allow(HTTParty).to receive(:post).and_raise(OpenSSL::SSL::SSLError, 'SSL verification failed')
          allow(Rails.logger).to receive(:error)
        end

        it 'catches the error and returns fallback message' do
          result = openai_client.chat(messages)
          expect(result).to eq("Sorry, I'm having trouble responding right now.")
        end
      end
    end

    context 'edge cases with unusual but valid responses' do
      context 'when response contains multiple choices' do
        let(:multiple_choices_response) do
          double('HTTParty::Response', code: 200, body: {
            "choices" => [
              { "message" => { "content" => "First response" } },
              { "message" => { "content" => "Second response" } }
            ]
          }.to_json)
        end

        before do
          allow(HTTParty).to receive(:post).and_return(multiple_choices_response)
        end

        it 'returns content from the first choice' do
          result = openai_client.chat(messages)
          expect(result).to eq("First response")
        end
      end

      context 'when content contains special characters and newlines' do
        let(:special_content) { "Hello!\n\nHere's some **markdown** and émojis: 🤖\n\n```code block```" }
        let(:special_chars_response) do
          double('HTTParty::Response', code: 200, body: {
            "choices" => [ { "message" => { "content" => special_content } } ]
          }.to_json)
        end

        before do
          allow(HTTParty).to receive(:post).and_return(special_chars_response)
        end

        it 'preserves special characters and formatting' do
          result = openai_client.chat(messages)
          expect(result).to eq(special_content)
        end
      end
    end
  end

  describe 'private methods' do
    describe '#headers' do
      it 'returns correct headers with API key' do
        headers = openai_client.send(:headers)
        expect(headers).to eq({
          "Content-Type" => "application/json",
          "Authorization" => "Bearer test-api-key"
        })
      end
    end
  end
end
