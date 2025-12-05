class ConversationSerializer
  include FastJsonapi::ObjectSerializer
  set_key_transform :camel_lower

  has_many :messages

  attributes :id, :title
  attribute :messages do |object|
    MessageSerializer.new(object.messages).serializable_hash[:data].map { |msg| msg[:attributes] }
  end
end
