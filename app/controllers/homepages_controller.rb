class HomepagesController < ApplicationController
  def index
  end

  def getPotholes
    @holes = Pothole.where('"potholes"."creation_date" IN (?) OR "potholes"."creation_date" IN (?)', params[:all_dates], params[:all_dates])
    respond_to do |format|
      format.html
      format.json { render :json => @holes }
    end
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
                           'attribute[WHEREIST]' => params["attribute"],
                           'activity[A511OPTN]' => params["activity"]})

    response = http.request(request)
    msg = response.body
    token = JSON.parse(msg).pop["token"]
    respond_to do |format|
      format.json {
        render :json => {msg: token}
        # render :json => "#{token.to_json}", :content_type => "text/html"
      }
    end
  end


end
