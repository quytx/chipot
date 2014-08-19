namespace :chipot do
    desc "Update the current database"
    task :update => :environment do
        puts "Updating..."
        Updater.update
        puts "your update is complete"
    end
end
