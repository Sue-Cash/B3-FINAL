class AddFieldsToTasks < ActiveRecord::Migration[7.2]
  def change
    add_column :tasks, :description, :text
    add_column :tasks, :completed_at, :datetime
    add_column :tasks, :reminder_date, :datetime
    add_column :tasks, :frequency, :string
    add_reference :tasks, :user, null: true, foreign_key: true
  end
end
