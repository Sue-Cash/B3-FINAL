class RemoveUserFromCategories < ActiveRecord::Migration[7.0]
  def change
    remove_reference :categories, :user, index: true, foreign_key: true
  end
end
