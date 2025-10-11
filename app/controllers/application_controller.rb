class ApplicationController < ActionController::API
  # uncomment below when ready to add session storage
  # before_action :authenticate_user
  include ActionController::Cookies

  private

  def current_user
    @current_user ||= User.find_by_id(session[:user_id])
  end

  def authenticate_user
    render json: { error: "Not Authorized" }, status: :unauthorized unless current_user
  end
end
