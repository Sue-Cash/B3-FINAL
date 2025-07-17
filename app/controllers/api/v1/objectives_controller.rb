module Api
  module V1
    class ObjectivesController < ApplicationController
      # on protège tout : authentification JWT obligatoire
      before_action :authenticate_request
      before_action :set_objective, only: %i[show update destroy]

      # GET /api/v1/objectives
      def index
        render json: @current_user.objectives, status: :ok
      end

      # POST /api/v1/objectives
      def create
        # on crée toujours pour le user courant
        obj = @current_user.objectives.build(objective_params)
        if obj.save
          render json: obj, status: :created
        else
          render json: { errors: obj.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/objectives/:id
      def show
        render json: @objective, status: :ok
      end

      # PATCH/PUT /api/v1/objectives/:id
      def update
        if @objective.update(objective_params)
          render json: @objective, status: :ok
        else
          render json: { errors: @objective.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/objectives/:id
      def destroy
        @objective.destroy
        head :no_content
      end

      private

      def set_objective
        # on ne peut accéder qu’à ses propres objectifs
        @objective = @current_user.objectives.find(params.require(:id))
      end

      def objective_params
        # ne plus autoriser :user_id, on ne la passe plus depuis le client
        params.require(:objective).permit(:title, :description, :due_date, :category_id)
      end
    end
  end
end
