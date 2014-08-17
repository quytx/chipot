require 'open-uri'

def test_request
  uri = URI.parse('http://test311request.cityofchicago.org/open311/v2/requests.json')

  http = Net::HTTP.new(uri.host, uri.port)
  request = Net::HTTP::Post.new(uri.request_uri)
  request.set_form_data({'api_key' => 'fb7c8238e1ac331ba5215a16743efb37',
                         'service_code'=> '4fd3b656e750846c53000004',
                         'lat' => 41.889132,
                         'long'=> -87.635719,
                         'address_string' => "123 Test Address",
                         'description' => "Testing the description field",
                         'activity[details][WHEREIST]'=> "CURB"})

  response = http.request(request)
  msg = response.body

  temp = JSON.parse(msg).pop["token"]
end