module Api
  module V1
    class TasksController < ApplicationController
      # Gestion centralisée des erreurs
      rescue_from ActiveRecord::RecordNotFound,    with: :render_not_found
      rescue_from ActionController::ParameterMissing, with: :render_bad_request
      rescue_from JSON::ParserError,               with: :render_bad_request

      before_action :set_task, only: %i[show update destroy]

      # GET /api/v1/tasks
      def index
        tasks = Task.all
        render json: tasks, status: :ok
      end

      # GET /api/v1/tasks/:id
      def show
        render json: @task, status: :ok
      end

      # POST /api/v1/tasks
      def create
        task = Task.new(task_params)
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
        @task = Task.find(params.require(:id))
      end

      def task_params
        params.require(:task).permit(
            :title,
            :description,
            :due_date,
            :completed_at,
            :reminder_date,
            :points,
            :priority,
            :status,
            :frequency,
            :objective_id,  
            :user_id        
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
