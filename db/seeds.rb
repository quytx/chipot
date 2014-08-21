# This file contains all the record creation needed to seed the database from the data of city of chicago.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).

class Seeder
  def self.seed
    (DateTime.new(2014,6,1).to_date..(DateTime.yesterday)).each do |d|
      puts "THIS IS IN THE CREATING RECORD IN ACTIVERECORD"
      puts d
      response = get_data(d.midnight)
      response.each do |record|
        Pothole.create(to_attrs(record).to_hash)
      end
    end
    cache_write
  end


  protected

  def self.cache_write
    temp = Pothole.all.group_by(&:creation_date)
    temp.each do |hole|
      puts "THIS IS CREATING CACHE"
      p hole[0]
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
