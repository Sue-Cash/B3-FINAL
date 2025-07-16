class AddFieldsToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :username, :string
    add_column :users, :total_points, :integer
    add_column :users, :level, :integer
    add_column :users, :two_factor_enabled, :boolean
    add_column :users, :google_oauth_token, :string
    add_column :users, :last_login_at, :datetime
  end
end
