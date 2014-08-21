class Photo < ActiveRecord::Base
  mount_uploader :url, PhotoUploader
end
