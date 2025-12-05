class MessageSerializer
  include FastJsonapi::ObjectSerializer

  set_key_transform :camel_lower

  attributes :id, :content, :role, :conversation_id
end
