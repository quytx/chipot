require 'rails_helper'

describe Updater do
  context 'has data' do
    it 'should process the data' do
      expect(Updater).to receive(:get_data).and_return(data)
      expect { Updater.update }.to change { Pothole.count }.by(2)
      pothole = Pothole.find_by(service_request_number: "14-01364820")
      expect(pothole).to_not be_nil
      expect(pothole.zip).to eq("60620")
    end
  end

  context 'has no data' do
    it 'should do nothing' do
      expect(Updater).to receive(:get_data).and_return([])
      expect { Updater.update }.to_not change { Pothole.count }
    end
  end

  protected

  def data
    [{:zip=>"60620", :police_district=>"6", :location=>{"needs_recoding"=>false, "longitude"=>"-87.63709228249597", "latitude"=>"41.75609485874788"}, :status=>"Open", :service_request_number=>"14-01364820", :x_coordinate=>"1174200.71100847", :creation_date=>"2014-08-18T00:00:00", :ward=>"17", :y_coordinate=>"1854519.80357137", :longitude=>"-87.63709228249597", :community_area=>"69", :type_of_service_request=>"Pothole in Street", :latitude=>"41.75609485874788", :street_address=>"501 W 76TH ST"}, {:zip=>"60659", :police_district=>"24", :location=>{"needs_recoding"=>false, "longitude"=>"-87.69581231625126", "latitude"=>"41.99057313736219"}, :status=>"Open", :service_request_number=>"14-01364871", :x_coordinate=>"1157579.56748018", :creation_date=>"2014-08-18T00:00:00", :ward=>"50", :y_coordinate=>"1939760.18513211", :longitude=>"-87.69581231625126", :community_area=>"2", :type_of_service_request=>"Pothole in Street", :latitude=>"41.99057313736219", :street_address=>"2630 W PETERSON AVE"}].
      map {|d| Hashie::Mash.new(d) }
  end
end
