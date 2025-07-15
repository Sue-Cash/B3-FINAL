class Objective < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many :tasks, dependent: :destroy

  validates :title, presence: true
  validates :due_date, presence: true
end
