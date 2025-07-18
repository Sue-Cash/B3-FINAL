# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_07_18_121724) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.string "icon"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "mail_configs", force: :cascade do |t|
    t.string "frequency"
    t.time "send_time"
    t.boolean "enabled"
    t.string "template"
    t.datetime "last_sent_at"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_mail_configs_on_user_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.string "message"
    t.datetime "scheduled_at"
    t.datetime "sent_at"
    t.string "notification_type"
    t.bigint "user_id", null: false
    t.bigint "task_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_id"], name: "index_notifications_on_task_id"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "objectives", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.date "due_date"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "category_id", null: false
    t.string "status"
    t.integer "priority"
    t.integer "total_points"
    t.float "progress_percentage"
    t.string "frequency"
    t.index ["category_id"], name: "index_objectives_on_category_id"
    t.index ["user_id"], name: "index_objectives_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "title"
    t.integer "points"
    t.integer "priority"
    t.date "due_date"
    t.string "status"
    t.bigint "objective_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.datetime "completed_at"
    t.datetime "reminder_date"
    t.string "frequency"
    t.bigint "user_id"
    t.index ["objective_id"], name: "index_tasks_on_objective_id"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "user_sessions", force: :cascade do |t|
    t.string "token"
    t.datetime "expires_at"
    t.string "ip_address"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "username"
    t.integer "total_points", default: 0, null: false
    t.integer "level", default: 1, null: false
    t.boolean "two_factor_enabled"
    t.string "google_oauth_token"
    t.datetime "last_login_at"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "mail_configs", "users"
  add_foreign_key "notifications", "tasks"
  add_foreign_key "notifications", "users"
  add_foreign_key "objectives", "categories"
  add_foreign_key "objectives", "users"
  add_foreign_key "tasks", "objectives"
  add_foreign_key "tasks", "users"
  add_foreign_key "user_sessions", "users"
end
