module ApplicationHelper
  def reformat(phone_num)
    phone_num.gsub(/\D/, "").insert(6, "-").insert(3, "-")
  end
end
