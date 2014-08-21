require 'rmagick'
require 'base64'
require 'securerandom'
module ApplicationHelper
  def reformat(phone_num)
    phone_num.gsub(/\D/, "").insert(6, "-").insert(3, "-")
  end

  def convertBase64ToImg(data)
    Magick::Image.read_inline(params[:imgBase64])[0]
  end

  def readImgFromUrl(url)
    Magick::Image.read(url)[0]
  end

  def flatten(bg, draw)
    path = 'public/uploads/' + SecureRandom.hex(10) + '.' + draw.format.downcase
    bg.composite(draw, 0, 0, Magick::OverCompositeOp).write(path)
    path
  end
end
