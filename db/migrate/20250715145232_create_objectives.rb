class CreateObjectives < ActiveRecord::Migration[7.2]
  def change
    create_table :objectives do |t|
      t.string :title
      t.text :description
      t.date :due_date
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
