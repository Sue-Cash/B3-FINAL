module Authenticable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
  end

  private

  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    
    if header
      decoded = JwtService.decode(header)
      @current_user = User.find(decoded[:user_id]) if decoded
    end
    
    render json: { error: 'Not Authorized' }, status: 401 unless @current_user
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Invalid token' }, status: 401
  end

  def current_user
    @current_user
  end
end