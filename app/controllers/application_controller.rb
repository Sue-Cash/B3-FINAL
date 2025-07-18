class ApplicationController < ActionController::API
  before_action :authenticate_request

  # Permet d'accéder à `current_user` dans tous les contrôleurs  
  attr_reader :current_user

  private

  def authenticate_request
    header = request.headers['Authorization']
    token  = header.split.last if header

    # on refuse si le token est manquant
    return render_unauthorized unless token

    decoded = JsonWebToken.decode(token)

    # on refuse si le decode échoue
    return render_unauthorized unless decoded

    @current_user = User.find_by(id: decoded[:user_id])

    # on refuse si l’utilisateur n’existe pas
    return render_unauthorized unless @current_user
  end

  def render_unauthorized
    render json: { error: 'Not Authorized' }, status: :unauthorized
  end
end
