class User < ApplicationRecord
  has_secure_password

  # Associations
  has_many :objectives, dependent: :destroy
  has_many :tasks, through: :objectives

  # Validations
  validates :email, presence: true, uniqueness: true
end
