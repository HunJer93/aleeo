class User < ApplicationRecord
  has_secure_password
  validates :username, presence: true, uniqueness: true
  validates :password, presence: true

  has_secure_password :recovery_password, validations: false
  has_many :conversations, dependent: :destroy
end
