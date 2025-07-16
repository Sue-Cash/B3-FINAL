Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Authentification
      post 'auth/register', to: 'authentication#register'
      post 'auth/login', to: 'authentication#login'
      post 'auth/logout', to: 'authentication#logout'
      
      # Resources existantes
      resources :users, only: %i[index show create update destroy]
      resources :objectives, only: %i[index show create update destroy]
      resources :tasks, only: %i[index show create update destroy]
      resources :categories, only: %i[index show create update destroy]
      
      # Nouvelles resources
      resources :notifications, only: %i[index show update]
    end
  end
end