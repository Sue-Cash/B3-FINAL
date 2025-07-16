class Objective < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many :tasks, dependent: :destroy
  
  # Énumérations
  STATUSES = %w[TODO IN_PROGRESS DONE].freeze
  FREQUENCIES = %w[UNIQUE DAILY WEEKLY MONTHLY CUSTOM].freeze
  
  validates :title, presence: true, length: { maximum: 100 }
  validates :due_date, presence: true
  validates :status, inclusion: { in: STATUSES }, allow_nil: true
  validates :frequency, inclusion: { in: FREQUENCIES }, allow_nil: true
  validates :priority, inclusion: { in: 1..5 }, allow_nil: true
  validates :total_points, numericality: { greater_than: 0 }, allow_nil: true
  
  before_save :calculate_progress
  after_update :update_user_points, if: :saved_change_to_status?
  
  scope :active, -> { where.not(status: 'DONE') }
  scope :completed, -> { where(status: 'DONE') }
  
  private
  
  def calculate_progress
    return self.progress_percentage = 0 if tasks.empty?
    completed_tasks = tasks.where(status: 'DONE').count
    self.progress_percentage = (completed_tasks.to_f / tasks.count * 100).round(2)
  end
  
  def update_user_points
    return unless total_points.present?
    
    if status == 'DONE' && status_before_last_save != 'DONE'
      user.increment!(:total_points, total_points)
      user.calculate_level
    elsif status_before_last_save == 'DONE' && status != 'DONE'
      user.decrement!(:total_points, total_points)
      user.calculate_level
    end
  end
end