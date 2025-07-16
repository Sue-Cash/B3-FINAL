class AddFieldsToObjectives < ActiveRecord::Migration[7.2]
  def change
    add_column :objectives, :status, :string
    add_column :objectives, :priority, :integer
    add_column :objectives, :total_points, :integer
    add_column :objectives, :progress_percentage, :float
    add_column :objectives, :frequency, :string
  end
end
