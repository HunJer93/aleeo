FactoryBot.define do
  factory :message do
    association :conversation
    role { "user" }
    content { "Test message content" }

    trait :assistant do
      role { "assistant" }
    end
  end
end
