class JwtService
  SECRET_KEY = Rails.application.credentials.secret_key_base || 'fallback_secret'

  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new decoded
  rescue JWT::DecodeError => e
    Rails.logger.error "JWT Decode Error: #{e.message}"
    nil
  end
end