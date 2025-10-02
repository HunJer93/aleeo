class CreateConversations < ActiveRecord::Migration[8.0]
  def change
    create_table :conversations do |t|
      t.string :title, default: "New Conversation"
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
