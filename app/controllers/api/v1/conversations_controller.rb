class Api::V1::ConversationsController < ApplicationController
  before_action :set_conversation, only: %i[ show update destroy ]

  # GET /conversations
  def index
    @conversations = Conversation.all

    render json: @conversations
  end

  # GET /conversations/1
  def show
    render json: @conversation
  end

  # POST /conversations
  def create
    @conversation = Conversation.new(conversation_params)

    if @conversation.save
      render json: ConversationSerializer.new(@conversation).serializable_hash[:data][:attributes], status: :created
    else
      render json: @conversation.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /conversations/1
  def update
    if @conversation.update(conversation_params)
      render json: ConversationSerializer.new(@conversation).serializable_hash[:data][:attributes], status: :ok
    else
      render json: @conversation.errors, status: :unprocessable_entity
    end
  end

  # DELETE /conversations/1
  def destroy
    @conversation.destroy!
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_conversation
      @conversation = Conversation.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def conversation_params
      params.require(:conversation).permit(:title, :user_id)
    end
end
