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
    binding.pry
    @conversation = Conversation.new(conversation_params)

    if @conversation.save
      render json: @conversation, status: :created # location: @conversation (add this back in when routing is set up)
    else
      render json: @conversation.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /conversations/1
  def update
    if @conversation.update(conversation_params)
      render json: @conversation
    else
      render json: @conversation.errors, status: :unprocessable_content
    end
  end

  # DELETE /conversations/1
  def destroy
    @conversation.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_conversation
      @conversation = Conversation.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def conversation_params
      params.expect(conversation: [ :title, :user_id ])
    end
end
