class User < ApplicationRecord
  has_secure_password

  # Associations
  has_many :objectives, dependent: :destroy
  has_many :tasks, through: :objectives
  has_many :direct_tasks, class_name: 'Task', foreign_key: 'user_id', dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_one :mail_config, dependent: :destroy
  has_many :user_sessions, dependent: :destroy
  has_many :categories, dependent: :destroy

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :username, presence: true, uniqueness: true, length: { minimum: 3 }
  validates :total_points, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :level, presence: true, numericality: { greater_than: 0 }
  
  # Callbacks
  after_create :create_default_mail_config, :create_default_categories
  
  # Méthodes
  def calculate_level
    new_level = (total_points / 100) + 1
    update(level: new_level) if new_level != level
  end
  
  private
  
  def create_default_mail_config
    MailConfig.create(user: self, frequency: 'weekly', enabled: true, send_time: '09:00')
  end
  
  def create_default_categories
    default_categories = [
      { name: 'Travail', icon: '💼', color: '#3B82F6' },
      { name: 'Personnel', icon: '🏠', color: '#10B981' },
      { name: 'Sport', icon: '🏃', color: '#F59E0B' },
      { name: 'Études', icon: '📚', color: '#8B5CF6' }
    ]
    
    default_categories.each do |cat|
      categories.create(cat)
    end
  end
end