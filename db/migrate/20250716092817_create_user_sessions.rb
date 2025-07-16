class CreateUserSessions < ActiveRecord::Migration[7.2]
  def change
    create_table :user_sessions do |t|
      t.string :token
      t.datetime :expires_at
      t.string :ip_address
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
