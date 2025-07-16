class Task < ApplicationRecord
  belongs_to :objective
  belongs_to :user
  has_many :notifications, dependent: :destroy
  
  # Énumérations (même que Objective pour cohérence)
  STATUSES = %w[TODO IN_PROGRESS DONE].freeze
  FREQUENCIES = %w[UNIQUE DAILY WEEKLY MONTHLY CUSTOM].freeze
  
  validates :title, presence: true, length: { maximum: 100 }
  validates :points, presence: true, numericality: { greater_than: 0 }
  validates :priority, presence: true, inclusion: { in: 1..5 }
  validates :due_date, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :frequency, inclusion: { in: FREQUENCIES }, allow_nil: true
  
  after_update :update_objective_progress, if: :saved_change_to_status?
  after_update :update_user_points, if: :saved_change_to_status?
  
  scope :active, -> { where.not(status: 'DONE') }
  scope :completed, -> { where(status: 'DONE') }
  scope :overdue, -> { where('due_date < ? AND status != ?', Time.current, 'DONE') }
  
  private
  
  def update_objective_progress
    objective&.save # Déclenche le callback calculate_progress
  end
  
  def update_user_points
    if status == 'DONE' && status_before_last_save != 'DONE'
      user.increment!(:total_points, points)
      user.calculate_level
    elsif status_before_last_save == 'DONE' && status != 'DONE'
      user.decrement!(:total_points, points)
      user.calculate_level
    end
  end
end