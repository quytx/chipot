# This file udpates the current database with the update vales called from the
# city of chicago website through a API call
class Updater

  def self.update
    datey = Date.today-1
    p datey.to_s
    d = datey.to_s+"T00:00:00"

    client = SODA::Client.new({:domain => "data.cityofchicago.org"})
    response = client.get("7as2-ds3y",{creation_date: "#{d}"})
    response.each do |pothole_record|
      pothole_record = pothole_record.to_hash
      values = {
        creation_date: pothole_record["creation_date"],
        completion_date: pothole_record["completion_date"],
        status: pothole_record["status"],
        street_address: pothole_record["street_address"],
        zip: pothole_record["zip"],
        latitude: pothole_record["latitude"],
        longitude: pothole_record["longitude"],
        service_request_number: pothole_record["service_request_number"],
        current_activity: pothole_record["current_activity"],
        most_recent_action: pothole_record["most_recent_action"]
      }


      ph = Pothole.find_or_initialize_by(service_request_number: values[:service_request_number])
      ph.update_attributes(values)

    end
  end
end
