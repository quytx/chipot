# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'soda/client'

client = SODA::Client.new({:domain => "data.cityofchicago.org", :app_token => ENV["App_Token"]})
count = 0
6.times do
  response = client.get("7as2-ds3y",{creation_date: "2014-08-1#{count}T00:00:00"})
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
