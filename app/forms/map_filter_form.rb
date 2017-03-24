class MapFilterForm < ApplicationForm
  extend ModelAttribute

  attribute :minus_keywords, :string
  attribute :min_attendees, :integer

  def self.build
    new({
      min_attendees: 5
    })
  end
end
