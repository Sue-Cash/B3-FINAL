 class Category < ApplicationRecord

   has_many :objectives, dependent: :destroy

   validates :name, presence: true, length: { maximum: 50 }
   validates :icon, presence: true
   validates :color, presence: true,
     format: { with: /\A#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\z/ }
 end
