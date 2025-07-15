module Api
  module V1
    class ObjectivesController < ApplicationController
      before_action :set_objective, only: %i[show update destroy]

      # GET /api/v1/objectives
      def index
        objectives = Objective.all
        render json: objectives, status: :ok
      end

      # GET /api/v1/objectives/:id
      def show
        render json: @objective, status: :ok
      end

      # POST /api/v1/objectives
      def create
        objective = Objective.new(objective_params)
        if objective.save
          render json: objective, status: :created
        else
          render json: { errors: objective.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT/PATCH /api/v1/objectives/:id
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
        @objective = Objective.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Objective not found' }, status: :not_found
      end

      def objective_params
        params.require(:objective).permit(:title, :description, :due_date, :user_id)
      end
    end
  end
end
