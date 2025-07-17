class AddDefaultsToUsers < ActiveRecord::Migration[7.2]
  def change
    change_column_default :users, :total_points, 0
    change_column_default :users, :level, 1
    change_column_null    :users, :total_points, false
    change_column_null    :users, :level, false
  end
end
