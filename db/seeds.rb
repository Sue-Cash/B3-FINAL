# db/seeds.rb

# 1) Clean slate
Task.destroy_all
Objective.destroy_all
Category.destroy_all
User.destroy_all

# 2) Test user
user = User.create!(
  email:                 'test@gmail.com',
  username:              'test',
  password:              'test01',
  password_confirmation: 'test01',
  total_points:          0,
  level:                 1
)

# 3) Four fixed categories
category_names = {
  'SANTE'           => '❤️',
  'PROFESSIONNELLE' => '💼',
  'PERSONNELLE'     => '🏠',
  'DIVERS'          => '🔧'
}

categories = category_names.map do |name, icon|
  Category.create!(
    name:  name,
    icon:  icon,
    color: '#CCCCCC'  # adjust default color if you wish
  )
end

# 4) One sample objective in the “SANTE” category
sante_category = categories.find { |c| c.name == 'SANTE' }

objective = Objective.create!(
  title:           'Faire 30 minutes de sport',
  description:     'Routine quotidienne pour la santé',
  user:            user,
  category:        sante_category,
  status:          'IN_PROGRESS',
  priority:        3,
  total_points:    50,
  due_date:        1.week.from_now.to_date,
  frequency:       'UNIQUE'  
)

# 5) One sample task under that objective
Task.create!(
  title:        'Courir 5 km',
  description:  'Aller courir autour du parc',
  user:         user,
  objective:    objective,
  status:       'TODO',
  priority:     2,
  points:       10,
  due_date:     Date.today,
  frequency:    'DAILY'
)

puts "Seed complete!"
puts "  Users:      #{User.count}"
puts "  Categories: #{Category.count}"
puts "  Objectives: #{Objective.count}"
puts "  Tasks:      #{Task.count}"
