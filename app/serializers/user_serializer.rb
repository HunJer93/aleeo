class UserSerializer < ActiveModel::Serializer
  include FastJsonapi::ObjectSerializer
  set_key_transform :camel_lower

  has_many :conversations

  attributes :id, :username, :first_name, :last_name

  attribute :conversations do |user|
    ConversationSerializer.new(user.conversations).serializable_hash[:data].map { |convo| convo[:attributes] }
  end
end
