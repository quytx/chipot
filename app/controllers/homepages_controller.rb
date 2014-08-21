class HomepagesController < ApplicationController
  respond_to :json

  # def index
  #   puts "************************ In Index ***************************"
  #   temp = Pothole.all.group_by(&:creation_date)
  #   temp.each do |hole|
  #     Rails.cache.write hole[0], hole[1].to_json
  #   end
  # end

  def getPotholes
    potholes = Hash[params[:all_dates].map do |date|
                      [date, Rails.cache.read(date)]
    end]
    respond_with potholes
  end

  def renderReport
  end

  def submitReport
    uri = URI.parse('http://test311request.cityofchicago.org/open311/v2/requests.json')
    api_key = ENV["open311_key"]

    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Post.new(uri.request_uri)
    request.set_form_data({'api_key' => api_key,
                           'service_code'=> '4fd3b656e750846c53000004',
                           'lat' => params["latitude"],
                           'long' => params["longitude"],
                           'address_string' => params["address"],
                           'description' => params["description"],
                           'attribute[WHEREIST]' => params["attribute"],
                           'phone' => params["phone"],
                           'media_url' => params["mediaUrl"]})

    response = http.request(request)
    msg = response.body
    token = JSON.parse(msg).pop["token"]
    respond_to do |format|
      format.json {
        render :json => {msg: token}
      }
    end
  end
end
