class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :task, optional: true
  
  TYPES = %w[reminder deadline completion system].freeze
  
  validates :message, presence: true
  validates :notification_type, inclusion: { in: TYPES }
  
  scope :unread, -> { where(is_read: false) }
  scope :recent, -> { order(created_at: :desc) }
  
  def mark_as_read!
    update(is_read: true)
  end
end