class HomeController < ApplicationController
  def index
    raise Meetup::Events.nearby.inspect
  end
end
