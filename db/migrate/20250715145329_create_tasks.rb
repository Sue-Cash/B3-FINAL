class CreateTasks < ActiveRecord::Migration[7.2]
  def change
    create_table :tasks do |t|
      t.string :title
      t.integer :points
      t.integer :priority
      t.date :due_date
      t.string :status
      t.references :objective, null: false, foreign_key: true

      t.timestamps
    end
  end
end
