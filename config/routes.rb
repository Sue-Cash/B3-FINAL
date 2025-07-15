Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users,      only: %i[index show create update destroy]
      resources :objectives, only: %i[index show create update destroy]
      resources :tasks,      only: %i[index show create update destroy]
    end
  end

  # Pour un simple check santé (optionnel)
  # get '/health_check', to: proc { [200, {}, ['OK']] }
end
