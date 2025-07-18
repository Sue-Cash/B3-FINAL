# app/controllers/api/v1/tasks_controller.rb
module Api
  module V1
    class TasksController < ApplicationController
      # Gestion centralisée des erreurs
      rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
      rescue_from ActionController::ParameterMissing, with: :render_bad_request
      rescue_from JSON::ParserError, with: :render_bad_request

      before_action :set_task, only: %i[show update destroy]
      before_action :set_objective, only: %i[create]

      # GET /api/v1/tasks
      def index
        # Récupérer toutes les tâches de l'utilisateur (directes + via objectifs)
        direct_tasks = @current_user.direct_tasks
        objective_tasks = Task.joins(:objective).where(objectives: { user_id: @current_user.id })
        
        tasks = (direct_tasks + objective_tasks).uniq
        render json: tasks, status: :ok
      end

      # GET /api/v1/tasks/:id
      def show
        render json: @task, status: :ok
      end

      # POST /api/v1/tasks
      def create
        # Si un objective_id est fourni, on crée la tâche pour cet objectif
        if params[:objective_id].present?
          task = @objective.tasks.build(task_params)
          task.user = @current_user
        else
          # Sinon, on crée une tâche directe pour l'utilisateur
          task = @current_user.direct_tasks.build(task_params)
        end

        if task.save
          render json: task, status: :created
        else
          render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/tasks/:id
      def update
        if @task.update(task_params)
          render json: @task, status: :ok
        else
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/tasks/:id
      def destroy
        @task.destroy
        head :no_content
      end

      private

      def set_task
        # Vérifier que la tâche appartient à l'utilisateur (directement ou via un objectif)
        @task = Task.joins("LEFT JOIN objectives ON tasks.objective_id = objectives.id")
                    .where("tasks.user_id = ? OR objectives.user_id = ?", @current_user.id, @current_user.id)
                    .find(params[:id])
      end

      def set_objective
        if params[:objective_id].present?
          @objective = @current_user.objectives.find(params[:objective_id])
        end
      end

      def task_params
        params.require(:task).permit(
          :title, :description, :due_date, :completed_at,
          :reminder_date, :points, :priority, :status,
          :frequency, :objective_id
        )
      end

      # --- gestion des erreurs ---
      def render_not_found(exception)
        render json: { error: exception.message }, status: :not_found
      end

      def render_bad_request(exception)
        render json: { error: exception.message }, status: :bad_request
      end
    end
  end
end