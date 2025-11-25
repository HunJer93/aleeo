require 'rails_helper'

RSpec.describe 'Messages', type: :request do
  let(:user) { create(:user) }
  let(:conversation) { create(:conversation, user: user) }
  let(:message) { create(:message, conversation: conversation) }
  let(:message_params) do
    {
      message: {
        content: 'This is a test message',
        conversation_id: conversation.id,
        role: 'user'
      }
    }
  end

  # Mock OpenAI client to avoid real API calls
  let(:mock_openai_client) { instance_double('OpenaiClient') }

  before do
    allow(OpenaiClient).to receive(:new).and_return(mock_openai_client)
    allow(mock_openai_client).to receive(:chat).and_return('Mocked AI response')
  end

  describe 'GET /api/v1/messages' do
    it 'should get index' do
      get '/api/v1/messages', as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST /api/v1/messages' do
    it 'should create message' do
      expect {
        post '/api/v1/messages',
        params: message_params,
        as: :json
      }.to change(Message, :count).by(2) # User message + AI assistant message

      expect(response).to have_http_status(:created)
    end
  end

  describe 'GET /api/v1/messages/:id' do
    it 'should show message' do
      get "/api/v1/messages/#{message.id}", as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe 'PATCH /api/v1/messages/:id' do
    it 'should update message' do
      patch "/api/v1/messages/#{message.id}",
            params: {
              message: {
                content: message.content,
                conversation_id: message.conversation_id,
                role: message.role
              }
            },
            as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe 'DELETE /api/v1/messages/:id' do
    it 'should destroy message' do
      message_to_delete = create(:message, conversation: conversation)

      expect {
        delete "/api/v1/messages/#{message_to_delete.id}", as: :json
      }.to change(Message, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
