class CreatePotholes < ActiveRecord::Migration
  def change
    create_table :potholes do |t|
      t.date :creation_date
      t.date :completion_date
      t.string :status
      t.string :street_address
      t.string :zip
      t.string :latitude
      t.string :longitude
      t.string :location
      t.string :service_request_number
      t.string :current_activity
      t.string :most_recent_action

      t.timestamps
    end
  end
end
