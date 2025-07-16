class UserSession < ApplicationRecord
  belongs_to :user
  
  validates :token, presence: true, uniqueness: true
  validates :expires_at, presence: true
  
  scope :active, -> { where('expires_at > ?', Time.current) }
  
  before_create :generate_token
  
  def active?
    expires_at > Time.current
  end
  
  def expire!
    update(expires_at: Time.current)
  end
  
  private
  
  def generate_token
    self.token = SecureRandom.hex(32)
    self.expires_at = 24.hours.from_now
  end
end