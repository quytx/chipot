class Pothole < ActiveRecord::Base
  validates_format_of :status, :without => /(dup)/i
end
