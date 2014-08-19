# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w( gmap.css )
Rails.application.config.assets.precompile += %w( gmap.js )
Rails.application.config.assets.precompile += %w( raphael-min.js )
Rails.application.config.assets.precompile += %w( raphael.sketchpad.js )
Rails.application.config.assets.precompile += %w( json2.js )
Rails.application.config.assets.precompile += %w( jquery.browser.min.js )
