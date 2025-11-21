class Api::V1::MessagesController < ApplicationController
  before_action :set_message, only: %i[ show update destroy ]

  # GET /messages
  def index
    @messages = Message.all

    render json: @messages
  end

  # GET /messages/1
  def show
    render json: @message
  end

  # POST /messages
  # chat with OpenAI API and return the AI assistant's message
  def create
    @message = Message.new(message_params)

    if @message.save
      # Call OpenAI API to get assistant response
      @assistant_response = openai_client.chat(@message.conversation.messages.map(&:format_for_openai))
      # create assistant message in the conversation
      @assistant_message = Message.new(conversation: @message.conversation, role: "assistant", content: @assistant_response)
      # serialize and return both user and assistant messages
      render json: {
        user_message: MessageSerializer.new(@message).serializable_hash[:data][:attributes],
        assistant_message: MessageSerializer.new(@assistant_message).serializable_hash[:data][:attributes]
      }, status: :created
    else
      render json: @message.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /messages/1
  def update
    if @message.update(message_params)
      render json: @message
    else
      render json: @message.errors, status: :unprocessable_entity
    end
  end

  # DELETE /messages/1
  def destroy
    @message.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def message_params
      params.expect(message: [ :conversation_id, :role, :content ])
    end

    def openai_client
      @openai_client ||= ::OpenaiClient.new
    end
end
