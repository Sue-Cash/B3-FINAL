module Api
  module V1
    class UsersController < ApplicationController
      # Gestion centralisée des erreurs
      rescue_from ActiveRecord::RecordNotFound,      with: :render_not_found
      rescue_from ActionController::ParameterMissing, with: :render_bad_request
      rescue_from JSON::ParserError,                 with: :render_bad_request

      before_action :set_user, only: %i[show update destroy]

      # GET /api/v1/users
      def index
        users = User.all
        render json: users, status: :ok
      end

      # GET /api/v1/users/:id
      def show
        render json: @user, status: :ok
      end

      # GET /api/v1/users/me
      # Renvoie l’utilisateur authentifié via le token
      def me
        render json: current_user, status: :ok
      end

      # POST /api/v1/signup
      # (on a mappé POST /api/v1/signup -> users#create)
      def create
        user = User.new(user_params)
        if user.save
          token = JsonWebToken.encode(user_id: user.id)
          render json: { user: user, token: token }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT/PATCH /api/v1/users/:id
      def update
        if @user.update(user_params)
          render json: @user, status: :ok
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/users/:id
      def destroy
        @user.destroy
        head :no_content
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      # ⚠️ on autorise ici username en plus de l’email+password
      def user_params
        params.require(:user).permit(
          :email,
          :username,
          :password,
          :password_confirmation,
          :total_points,
        )
      end

      def render_not_found(exception)
        render json: { error: exception.message }, status: :not_found
      end

      def render_bad_request(exception)
        render json: { error: exception.message }, status: :bad_request
      end
    end
  end
end
