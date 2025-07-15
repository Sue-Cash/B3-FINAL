class AddCategoryToObjectives < ActiveRecord::Migration[7.2]
  def change
    add_reference :objectives, :category, foreign_key: true, null: true
  end
end
