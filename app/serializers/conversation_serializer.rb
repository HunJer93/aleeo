class ConversationSerializer < ActiveModel::Serializer
  include FastJsonapi::ObjectSerializer

  set_key_transform :camel_lower

  attributes :id, :title
  has_many :messages, serializer: MessageSerializer
end
