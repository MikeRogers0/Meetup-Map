class EventsController < ApplicationController
  layout "kml"

  def nearby
    @map_filter_form = MapFilterForm.build
    @map_filter_form.attributes = map_filter_form_params

    if @map_filter_form.valid?
      respond_to :xml
    else
      head :unprocessable_entity
    end
  end

  private
  def map_filter_form_params
    params.require(:map_filter_form).permit(:latitude, :longitude, :start_datetime, :end_datetime, :keywords, :minus_keywords, :radius, :min_attendees)
  end
end
