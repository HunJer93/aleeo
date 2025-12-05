class Api::V1::SessionsController < ApplicationController
  def create
    user = User.includes(conversations: :messages).find_by(username: params[:username])&.authenticate(params[:password])
    if user
      # add session storage in future
      if params[:remember_me]
        # WIP session storage - skip for now since remember_token is not implemented
        # cookies.permanent[:remember_token] = user.remember_token
      else
        session[:user_id] = user.id
      end
      render json: serialize_user(user), status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def show
    if current_user
      render json: serialize_user(current_user), status: :ok
    else
      render json: { error: "Not authenticated" }, status: :unauthorized
    end
  end

  def destroy
    session.delete(:user_id)
    head :no_content
  end

  private

    # Only allow a list of trusted parameters through.
    def user_params
      params.permit(:username, :password, :remember_me)
    end

    def serialize_user(user)
      UserSerializer.new(user).serializable_hash[:data][:attributes]
    end
end
