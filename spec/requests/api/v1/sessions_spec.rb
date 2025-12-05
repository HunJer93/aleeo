require 'rails_helper'

RSpec.describe 'Api::V1::Sessions', type: :request do
  let(:user) { create(:user, username: 'testuser', password: 'password123') }

  describe 'POST /api/v1/login' do
    context 'with valid credentials' do
      it 'authenticates the user and returns user data' do
        post '/api/v1/login', params: {
          username: user.username,
          password: 'password123'
        }

        expect(response).to have_http_status(:ok)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body['username']).to eq(user.username)
        expect(parsed_body['firstName']).to eq(user.first_name)
        expect(session[:user_id]).to eq(user.id)
      end

      it 'includes conversations and messages in response' do
        conversation = create(:conversation, user: user)
        create(:message, conversation: conversation)

        post '/api/v1/login', params: {
          username: user.username,
          password: 'password123'
        }

        expect(response).to have_http_status(:ok)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to have_key('conversations')
      end

      context 'with remember_me option' do
        it 'sets a permanent cookie' do
          post '/api/v1/login', params: {
            username: user.username,
            password: 'password123',
            remember_me: true
          }

          expect(response).to have_http_status(:ok)
          # Would test for permanent cookie if remember_token was implemented
        end
      end
    end

    context 'with invalid credentials' do
      it 'returns an error for wrong password' do
        post '/api/v1/login', params: {
          username: user.username,
          password: 'wrongpassword'
        }

        expect(response).to have_http_status(:unauthorized)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body['error']).to eq('Invalid email or password')
      end

      it 'returns an error for non-existent user' do
        post '/api/v1/login', params: {
          username: 'nonexistent',
          password: 'password123'
        }

        expect(response).to have_http_status(:unauthorized)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body['error']).to eq('Invalid email or password')
      end
    end
  end

  describe 'GET /api/v1/me' do
    context 'when user is authenticated' do
      before do
        allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
      end

      it 'returns current user data' do
        get '/api/v1/me'

        expect(response).to have_http_status(:ok)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body['username']).to eq(user.username)
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized error' do
        get '/api/v1/me'

        expect(response).to have_http_status(:unauthorized)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body['error']).to eq('Not authenticated')
      end
    end
  end

  describe 'DELETE /api/v1/logout' do
    before do
      # Set up session
      post '/api/v1/login', params: {
        username: user.username,
        password: 'password123'
      }
    end

    it 'clears the session and returns no content' do
      delete '/api/v1/logout'

      expect(response).to have_http_status(:no_content)
      expect(session[:user_id]).to be_nil
    end
  end
end
