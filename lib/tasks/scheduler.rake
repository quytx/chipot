desc "Update the current database"
task :update => :environment do
    puts "Updating the database with new entries..."
    Updater.update
    puts "Updation of database is complete"
end
