FactoryBot.define do
  factory :user do
    sequence(:username) { |n| "user#{n}" }
    first_name { "John" }
    last_name { "Doe" }
    password { "password123" }
    password_confirmation { "password123" }
  end
end
