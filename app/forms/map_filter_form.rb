class MapFilterForm < ApplicationForm
  extend ModelAttribute

  attribute :start_datetime, :datetime
  attribute :end_datetime, :datetime

  attribute :latitude, :float
  attribute :longitude, :float

  attribute :radius, :integer

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
end
