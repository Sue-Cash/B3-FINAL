class CreateMailConfigs < ActiveRecord::Migration[7.2]
  def change
    create_table :mail_configs do |t|
      t.string :frequency
      t.time :send_time
      t.boolean :enabled
      t.string :template
      t.datetime :last_sent_at
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
