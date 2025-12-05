FactoryBot.define do
  factory :conversation do
    association :user
    title { "Test Conversation" }
  end
end
