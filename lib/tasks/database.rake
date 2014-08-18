namespace :chipot do
    desc "Update the current database"
    task :update => :environment do
        # abcs = ActiveRecord::Base.configurations
        # ActiveRecord::Base.establish_connection(abcs[RAILS_ENV])
        # ActiveRecord::Base.connection.recreate_database(ActiveRecord::Base.connection.current_database)
        puts "Updating..."
        Updater.update
        puts "your update is complete"
    end
end
