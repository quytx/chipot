# This file contains all the record creation needed to seed the database from the data of city of chicago.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).


client = SODA::Client.new({:domain => "data.cityofchicago.org", :app_token => ENV["App_Token"]})
count = 1

# datey = Date.today-30
# p datey.to_s
# d = datey.to_s+"T00:00:00"



(Date.new(2014,05,01)..Date.new(2014,07,31)).each do |d|
  p d
  d = d.to_s+"T00:00:00"
  response = client.get("7as2-ds3y",{creation_date: "#{d}"})
  response.each do |element|
    element = element.to_hash
    values = {
      creation_date: element["creation_date"],
      completion_date: element["completion_date"],
      status: element["status"],
      street_address: element["street_address"],
      zip: element["zip"],
      latitude: element["latitude"],
      longitude: element["longitude"],
      service_request_number: element["service_request_number"],
      current_activity: element["current_activity"],
      most_recent_action: element["most_recent_action"]
    }

    Pothole.create(values)
  end
  count +=1
end
