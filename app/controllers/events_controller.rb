class EventsController < ApplicationController
  layout "kml"

  def nearby
    respond_to :xml
  end
end
