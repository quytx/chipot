# This file contains all the record creation needed to seed the database from the data of city of chicago.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).


client = SODA::Client.new({:domain => "data.cityofchicago.org", :app_token => ENV["App_Token"]})
count = 1

# datey = Date.today-30
# p datey.to_s
# d = datey.to_s+"T00:00:00"


class Seeder
  def self.seed
    (DateTime.new(2014,5,1).to_date..(DateTime.yesterday)).each do |d|
      p d.midnight
      response = get_data(d.midnight)
      response.each do |record|
        Pothole.create(to_attrs(record).to_hash)
      end
      cache_write
    end
  end


  protected

  def cache_write
    temp = Pothole.all.group_by(&:creation_date)
    temp.each do |hole|
      Rails.cache.write hole[0], hole[1].map(&:attributes)
    end
  end

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


Seeder.seed
