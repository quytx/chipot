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
end