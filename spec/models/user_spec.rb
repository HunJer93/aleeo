require 'rails_helper'

RSpec.describe User, type: :model do
  subject { build(:user) }

  describe 'validations' do
    it { should validate_presence_of(:username) }
    it { should validate_uniqueness_of(:username) }
    it { should validate_presence_of(:password) }
    it { should have_secure_password }
    it { should have_secure_password(:recovery_password) }
  end

  describe 'associations' do
    it { should have_many(:conversations).dependent(:destroy) }
  end
end
