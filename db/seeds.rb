# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#

# Nettoyer les données existantes
User.destroy_all
Category.destroy_all
Objective.destroy_all
Task.destroy_all

# Créer un utilisateur de test
user = User.create!(
  email: 'test@taskcoeur.com',
  password: 'password123',
  username: 'testuser',
  total_points: 0,
  level: 1
)

# Créer des catégories
work_category = user.categories.create!(
  name: 'Travail',
  icon: '💼',
  color: '#3B82F6'
)

personal_category = user.categories.create!(
  name: 'Personnel',
  icon: '🏠',
  color: '#10B981'
)

# Créer un objectif
objective = user.objectives.create!(
  title: 'Finir le projet TaskCoeur',
  description: 'Développer l\'application complète',
  status: 'IN_PROGRESS',
  priority: 5,
  total_points: 100,
  due_date: 1.month.from_now,
  frequency: 'UNIQUE',
  category: work_category
)

# Créer des tâches
task1 = objective.tasks.create!(
  title: 'Implémenter les modèles',
  description: 'Créer tous les modèles Rails',
  status: 'DONE',
  priority: 4,
  points: 20,
  due_date: 1.week.ago,
  frequency: 'UNIQUE',
  user: user
)

task2 = objective.tasks.create!(
  title: 'Créer les contrôleurs API',
  description: 'Développer les contrôleurs REST',
  status: 'IN_PROGRESS',
  priority: 4,
  points: 30,
  due_date: 2.weeks.from_now,
  frequency: 'UNIQUE',
  user: user
)

puts "✅ Utilisateur créé : #{user.email}"
puts "✅ Catégories créées : #{user.categories.count}"
puts "✅ Objectifs créés : #{user.objectives.count}"
puts "✅ Tâches créées : #{Task.count}"
puts "✅ Points utilisateur : #{user.reload.total_points}"