class Meetup::FindEvents < Meetup::BaseAPI
  def self.nearby
    Meetup::FindEvents.new.get({
      lat: "51.5074",
      lon: "0.1278",
      format: 'json',
      status: 'upcoming',
      page: '1',
      radius: '100',
      time: "#{Time.now.to_i * 1000},#{(Time.now.beginning_of_day + 5.day).to_i * 1000}"
    })
  end

  private
  def path
    "/find/events"
  end
end
