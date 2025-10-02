class User < ApplicationRecord
  has_secure_password
  has_secure_password :recovery_password, validations: false
  has_many :conversations, dependent: :destroy
end
