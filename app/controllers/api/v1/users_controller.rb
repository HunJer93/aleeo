class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: %i[ show update destroy ]

  # GET /users
  def index
    @users = User.all

    render json: @users
  end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  def create
    # Validate password confirmation
    if user_params[:password] != user_params[:confirm_password]
      render json: { error: "Password and confirm password do not match" }, status: :unprocessable_content
      return
    end

    # Remove confirm_password from params before creating user
    user_creation_params = user_params.except(:confirm_password)
    @user = User.new(user_creation_params)

    if @user.save
      session[:user_id] = @user.id
      render json: UserSerializer.new(@user).serializable_hash[:data][:attributes], status: :created
    else
      render json: @user.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_content
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:first_name, :last_name, :username, :password, :confirm_password)
    end
end
