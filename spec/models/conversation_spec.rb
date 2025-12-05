require 'rails_helper'

RSpec.describe Conversation, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:messages).dependent(:destroy) }
  end
end
