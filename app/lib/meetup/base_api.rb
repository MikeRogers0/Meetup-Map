require 'net/http'

class Meetup::BaseAPI
  BASE_URL = 'http://api.meetup.com/'
  CHARSET = 'UTF-8'

  def get(params)
    build_url(params)

    Rails.logger.info "[#{self.class.to_s}] GET: #{url}"

    JSON.parse(send_request.body)
  end

  private
  def path
    raise NotImplementedError
  end

  def build_url params
    @url = "#{BASE_URL}#{path}?#{query_string(params)}"
  end

  def url
    @url
  end

  def send_request
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Get.new(uri.request_uri)
    request.initialize_http_header(headers)

    http.request(request)
  end

  def api_key
    ENV["MEETUP_API_KEY"]
  end

  def headers
    { 'Accept-Charset' => CHARSET }
  end

  def query_string(params)
    params = params.merge( { key: api_key } )
    params.map { |k,v| "#{k}=#{v}" }.join("&")
  end
end
