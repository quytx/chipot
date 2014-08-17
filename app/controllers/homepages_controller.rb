class HomepagesController < ApplicationController
  def index
  end

  def getPotholes
    @holes = Pothole.all
    respond_to do |format|
      format.html
      format.json { render :json => @holes }
    end
  end


  def renderReport
    @report = Pothole.new

    uri = URI.parse('http://test311request.cityofchicago.org/open311/v2/requests.json')
    API_KEY = ENV["open311_key"]

    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Post.new(uri.request_uri)
    request.set_form_data({'api_key' => API_KEY,
                           'service_code'=> '4fd3b656e750846c53000004',
                           'lat' => 41.881232,
                           'long'=> -87.632719,
                           'address_string' => "Test 2",
                           'description' => "Testing",
                           'attribute[WHEREIST]'=> "CURB"})

    response = http.request(request)
    msg = response.body

    token = JSON.parse(msg).pop["token"]
    render partial: "reportForm"
  end

  def submitReport

  end


end
