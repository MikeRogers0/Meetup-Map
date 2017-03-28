class MapFilterForm < ApplicationForm
  extend ModelAttribute

  attribute :latitude, :string
  attribute :longitude, :string

  attribute :start_datetime, :time
  attribute :end_datetime, :time

  attribute :radius, :integer

  attribute :keywords, :string
  attribute :minus_keywords, :string
  attribute :min_attendees, :integer

  def self.build
    new({
      start_datetime: Time.now,
      end_datetime: Time.now.beginning_of_day + 5.day,
      latitude: 51.5074,
      longitude: 0.1278,
      radius: 25,
      min_attendees: 5
    })
  end

  def to_query
    attributes.merge({
      start_datetime: @start_datetime.to_i,
      end_datetime: @end_datetime.to_i
    }).to_query
  end

  def events
    # Filter keywords / attendees 
    Meetup::FindEvents.nearby({
      text: keywords,
      lat: @latitude,
      lon: @longitude,
      radius: @radius,
      time: "#{@start_datetime.to_i * 1000},#{@end_datetime.to_i * 1000}"
    }).select do |event|
      event["yes_rsvp_count"] >= @min_attendees
    end
  end
end
