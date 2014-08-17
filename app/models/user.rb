class User < ActiveRecord::Base
  include ApplicationHelper
  before_save { self.email = email.downcase }
  before_save { self.phone = reformat(self.phone) }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  VALID_PHONE_REGEX = /\A\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\z/
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence:   true,
                    format:     { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }

  validates :phone, presence: true,
                       format: 	{ with: VALID_PHONE_REGEX }

  has_secure_password
  validates :password, length: { minimum: 6 }
end
