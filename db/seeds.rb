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
  password_confirmation: 'test01'
)

# 3) Four global categories
['SANTE', 'PROFESSIONNELLE', 'PERSONNELLE', 'DIVERS'].each do |name|
  icon = case name
    when 'SANTE'           then '❤️'
    when 'PROFESSIONNELLE' then '💼'
    when 'PERSONNELLE'     then '🏠'
    when 'DIVERS'          then '🔧'
  end

  Category.create!(
    name:  name,
    icon:  icon,
    color: '#CCCCCC'
  )
end

# 4) Sample objective in SANTE
sante = Category.find_by!(name: 'SANTE')
objective = Objective.create!(
  title:        'Faire 30 minutes de sport',
  description:  'Routine quotidienne pour la santé',
  user:         user,
  category:     sante,
  status:       'IN_PROGRESS',
  priority:     3,
  total_points: 50,
  due_date:     1.week.from_now.to_date,
  frequency:    'DAILY'
)

# 5) Sample task
Task.create!(
  title:       'Courir 5 km',
  description: 'Aller courir autour du parc',
  user:        user,
  objective:   objective,
  status:      'TODO',
  priority:    2,
  points:      10,
  due_date:    Date.today,
  frequency:   'UNIQUE'
)

puts "Seed complete!"
puts "  Users:      #{User.count}"
puts "  Categories: #{Category.count}"
puts "  Objectives: #{Objective.count}"
puts "  Tasks:      #{Task.count}"
