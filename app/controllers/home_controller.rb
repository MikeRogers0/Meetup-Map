class HomeController < ApplicationController
  def index
    #Meetup::FindEvents.nearby
  end

  def kml
    respond_to :kml
  end
end
