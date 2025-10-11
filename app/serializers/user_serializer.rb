class UserSerializer < ActiveModel::Serializer
  include FastJsonapi::ObjectSerializer

  set_key_transform :camel_lower

  attributes :id, :username, :first_name, :last_name

  has_many :conversations, serializer: ConversationSerializer
end
