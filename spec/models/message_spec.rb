require 'rails_helper'

RSpec.describe Message, type: :model do
  describe 'associations' do
    it { should belong_to(:conversation) }
  end

  describe 'validations' do
    it { should validate_inclusion_of(:role).in_array(%w[user assistant]) }
  end

  describe '#format_for_openai' do
    let(:message) { create(:message, role: 'user', content: 'Hello world') }

    it 'returns correct hash format' do
      result = message.format_for_openai

      expect(result).to eq({
        role: 'user',
        content: 'Hello world'
      })
    end
  end
end
