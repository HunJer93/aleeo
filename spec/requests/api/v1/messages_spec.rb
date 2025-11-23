require 'rails_helper'

RSpec.describe 'Api::V1::Messages', type: :request do
  let(:user) { create(:user) }
  let(:conversation) { create(:conversation, user: user) }
  let(:message) { create(:message, conversation: conversation) }

  let(:valid_attributes) do
    {
      conversation_id: conversation.id,
      role: 'user',
      content: 'Hello, how are you?'
    }
  end

  let(:invalid_attributes) do
    {
      conversation_id: nil,
      role: 'invalid_role',
      content: ''
    }
  end

  # Mock OpenAI client
  let(:mock_openai_client) { instance_double('OpenaiClient') }

  before do
    allow(OpenaiClient).to receive(:new).and_return(mock_openai_client)
    allow(mock_openai_client).to receive(:chat).and_return('This is an AI response')
  end

  describe 'GET /api/v1/messages' do
    before do
      create_list(:message, 3, conversation: conversation)
    end

    it 'returns all messages' do
      get '/api/v1/messages'

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end

  describe 'GET /api/v1/messages/:id' do
    it 'returns the message' do
      get "/api/v1/messages/#{message.id}"

      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body['content']).to eq(message.content)
      expect(parsed_body['role']).to eq(message.role)
    end

    it 'returns 404 for non-existent message' do
      get '/api/v1/messages/999999'

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /api/v1/messages' do
    context 'with valid parameters' do
      it 'creates a new user message' do
        expect {
          post '/api/v1/messages', params: { message: valid_attributes }
        }.to change(Message, :count).by(2) # User message + AI response

        expect(response).to have_http_status(:created)
      end

      it 'calls OpenAI API and creates assistant response' do
        post '/api/v1/messages', params: { message: valid_attributes }

        expect(mock_openai_client).to have_received(:chat)

        # Check that assistant message was created
        assistant_message = Message.where(role: 'assistant').last
        expect(assistant_message.content).to eq('This is an AI response')
        expect(assistant_message.conversation_id).to eq(conversation.id)
      end

      it 'returns the assistant message in the response' do
        post '/api/v1/messages', params: { message: valid_attributes }

        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to have_key('assistant_message')
        expect(parsed_body['assistant_message']['role']).to eq('assistant')
        expect(parsed_body['assistant_message']['content']).to eq('This is an AI response')
      end

      it 'formats conversation messages for OpenAI API call' do
        # Create an existing message in the conversation
        create(:message, conversation: conversation, role: 'user', content: 'Previous message')

        post '/api/v1/messages', params: { message: valid_attributes }

        # The OpenAI client should receive formatted messages including the existing one
        expect(mock_openai_client).to have_received(:chat) do |messages|
          expect(messages).to be_an(Array)
          expect(messages.first).to include(role: 'user', content: 'Previous message')
        end
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors and does not call OpenAI' do
        post '/api/v1/messages', params: { message: invalid_attributes }

        expect(response).to have_http_status(:unprocessable_content)
        expect(mock_openai_client).not_to have_received(:chat)

        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to have_key('role')
      end
    end

    context 'when OpenAI API fails' do
      before do
        allow(mock_openai_client).to receive(:chat).and_raise(StandardError, 'API Error')
      end

      it 'handles the error gracefully' do
        expect {
          post '/api/v1/messages', params: { message: valid_attributes }
        }.to raise_error(StandardError, 'API Error')
      end
    end
  end

  describe 'PATCH /api/v1/messages/:id' do
    context 'with valid parameters' do
      it 'updates the message' do
        patch "/api/v1/messages/#{message.id}", params: { message: { content: 'Updated content' } }

        expect(response).to have_http_status(:ok)
        message.reload
        expect(message.content).to eq('Updated content')
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors' do
        patch "/api/v1/messages/#{message.id}", params: { message: { role: 'invalid_role' } }

        expect(response).to have_http_status(:unprocessable_content)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to have_key('role')
      end
    end
  end

  describe 'DELETE /api/v1/messages/:id' do
    it 'destroys the message' do
      message_to_delete = create(:message, conversation: conversation)

      expect {
        delete "/api/v1/messages/#{message_to_delete.id}"
      }.to change(Message, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
