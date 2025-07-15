class Category < ApplicationRecord
  has_many :objectives, dependent: :nullify
  validates :name, presence: true
end
