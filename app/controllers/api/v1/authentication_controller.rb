module Api
  module V1
    class AuthenticationController < ApplicationController
      # on ne demande PAS de token sur register et login
      skip_before_action :authenticate_request, only: %i[register login]

      def register
        user = User.new(user_params)
        if user.save
          token = JwtService.encode(user_id: user.id)
          render json: {
            token: token,
            user: user_response(user),
            message: 'Compte créé avec succès'
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email])
        if user&.authenticate(params[:password])
          token = JwtService.encode(user_id: user.id)
          user.update(last_login_at: Time.current)
          render json: { token: token, user: user_response(user) }, status: :ok
        else
          render json: { error: 'Identifiants invalides' }, status: :unauthorized
        end
      end

      def logout
        render json: { message: 'Déconnexion réussie' }, status: :ok
      end

      private

      def user_params
        params.require(:user).permit(:email, :password, :username, :password_confirmation)
      end

      def user_response(user)
        {
          id: user.id,
          email: user.email,
          username: user.username,
          total_points: user.total_points,
          level: user.level
        }
      end
    end
  end
end
