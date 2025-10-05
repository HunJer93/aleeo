class Api::V1::SessionsController < ApplicationController
  def create
    user = User.find_by(username: params[:username])&.authenticate(params[:password])
    if user
      # add session storage in future
      if params[:remember_me]
        # WIP session storage
        cookies.permanent[:remember_token] = user.remember_token
      else
        session[:user_id] = user.id
      end
      render json: user, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
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
end
