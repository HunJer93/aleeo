require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  let(:user) { create(:user) }
  let(:valid_attributes) do
    {
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      password: 'password123',
      confirm_password: 'password123'
    }
  end

  let(:invalid_attributes) do
    {
      first_name: '',
      last_name: 'Doe',
      username: '',
      password: 'password123',
      confirm_password: 'different_password'
    }
  end

  describe 'GET /api/v1/users' do
    before do
      create_list(:user, 3)
    end

    it 'returns all users' do
      get '/api/v1/users'

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end

  describe 'GET /api/v1/users/:id' do
    it 'returns the user' do
      get "/api/v1/users/#{user.id}"

      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body['username']).to eq(user.username)
    end

    it 'returns 404 for non-existent user' do
      get '/api/v1/users/999999'

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /api/v1/users' do
    context 'with valid parameters' do
      it 'creates a new user' do
        expect {
          post '/api/v1/users', params: { user: valid_attributes }
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body['username']).to eq('johndoe')
        expect(parsed_body['firstName']).to eq('John')  # Using camelCase from serializer
      end

      it 'sets the session user_id' do
        post '/api/v1/users', params: { user: valid_attributes }

        expect(session[:user_id]).to eq(User.last.id)
      end
    end

    context 'with password confirmation mismatch' do
      it 'returns an error' do
        post '/api/v1/users', params: { user: invalid_attributes }

        expect(response).to have_http_status(:unprocessable_content)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body['error']).to eq('Password and confirm password do not match')
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors' do
        invalid_params = valid_attributes.merge(username: '', first_name: '')

        post '/api/v1/users', params: { user: invalid_params }

        expect(response).to have_http_status(:unprocessable_content)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to have_key('username')
        expect(parsed_body).to have_key('first_name')
      end
    end
  end

  describe 'PATCH /api/v1/users/:id' do
    context 'with valid parameters' do
      it 'updates the user' do
        patch "/api/v1/users/#{user.id}", params: { user: { first_name: 'Updated' } }

        expect(response).to have_http_status(:ok)
        user.reload
        expect(user.first_name).to eq('Updated')
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors' do
        patch "/api/v1/users/#{user.id}", params: { user: { username: '' } }

        expect(response).to have_http_status(:unprocessable_content)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to have_key('username')
      end
    end
  end

  describe 'DELETE /api/v1/users/:id' do
    it 'destroys the user' do
      user_to_delete = create(:user)

      expect {
        delete "/api/v1/users/#{user_to_delete.id}"
      }.to change(User, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
