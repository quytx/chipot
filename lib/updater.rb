# This file udpates the current database with the update vales called from the
# city of chicago website through a API call
class Updater
  def self.update
    date = DateTime.yesterday.yesterday
    potholes = get_data(date.midnight).map do |pothole_record|
      ph = Pothole.find_or_initialize_by(service_request_number: pothole_record[:service_request_number])
      ph.update_attributes(to_attrs(pothole_record).to_hash)
      ph
    end
    Rails.cache.write(date.to_s, potholes.map(&:attributes))
  end

  protected

  def self.to_attrs(pothole)
    pothole.slice(:creation_date, :completion_date, :status, :street_address,
                  :service_request_number, :zip, :latitude, :longitude,
                  :current_activity, :most_recent_action)
  end

  def self.client
    @client ||= SODA::Client.new({:domain => "data.cityofchicago.org"})
  end

  def self.get_data(datetime)
    client.get("7as2-ds3y", { creation_date: to_weird_date(datetime) })
  end

  def self.to_weird_date(datetime)
    datetime.strftime("%Y-%m-%dT%H:%M:%S")
  end
end
