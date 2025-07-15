class Task < ApplicationRecord
  belongs_to :objective
  has_one :user, through: :objective

  validates :title, :points, :priority, :due_date, :status, presence: true
  validates :points, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :priority, numericality: { only_integer: true, greater_than: 0 }
  validates :status, inclusion: { in: %w[pending in_progress done] }
end
