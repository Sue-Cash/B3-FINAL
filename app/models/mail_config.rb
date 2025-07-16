class MailConfig < ApplicationRecord
  belongs_to :user
  
  FREQUENCIES = %w[daily weekly monthly never].freeze
  
  validates :frequency, inclusion: { in: FREQUENCIES }
  validates :send_time, presence: true, if: -> { enabled? }
  
  def should_send_today?
    return false unless enabled?
    
    case frequency
    when 'daily'
      true
    when 'weekly'
      Date.current.wday == 1 # Lundi
    when 'monthly'
      Date.current.day == 1  # Premier du mois
    else
      false
    end
  end
end