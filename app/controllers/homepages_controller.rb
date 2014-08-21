class HomepagesController < ApplicationController
  include ApplicationHelper
  def index
  end

  def getPotholes
    @holes = Pothole.where('"potholes"."creation_date" IN (?) OR "potholes"."completion_date" IN (?)', params[:all_dates], params[:all_dates])
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

  def uploadToS3
    @photo = Photo.new(photo_params)
    respond_to do |format|
      if @photo.save
        format.html 
        format.json { render :json => { url: @photo.url.medium } }
      else
        format.html 
        format.json { render :json => { url: 'none'} }
      end
    end
  end

  def processImg
    
    draw_img = convertBase64ToImg(params[:imgBase64])
    bg_img = readImgFromUrl(params[:bgURL])
    saved_img = File.open(flatten(bg_img, draw_img))

    #push to s3
    @photo = Photo.new(url: saved_img)
    respond_to do |format|
      if @photo.save
        format.html 
        format.json { render :json => { url: @photo.url.medium } }
      else
        format.html 
        format.json { render :json => { url: 'none'} }
      end
    end
  end

  private

  def photo_params
      params.require(:photo).permit(:url)
  end
end
