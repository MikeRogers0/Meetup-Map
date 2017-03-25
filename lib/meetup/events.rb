class Meetup::Events
  def self.nearby
    @nearby ||= Rails.cache.fetch("/nearby/51.5074/0.1278", expires_in: 24.hours) do
      @nearby ||= MeetupApi.new.find_events({
        lat: "51.5074",
        lon: "0.1278",
        format: 'json',
        status: 'upcoming',
        page: '1',
        radius: '100',
        time: "#{Time.now.to_i * 1000},#{(Time.now.beginning_of_day + 5.day).to_i * 1000}"
      })
    end
  end
end
