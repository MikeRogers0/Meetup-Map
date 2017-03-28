class Meetup::FindEvents < Meetup::BaseAPI
  def self.nearby attributes={}
    Meetup::FindEvents.new.get({
      lat: "51.5074",
      lon: "0.1278",
      format: 'json',
      page: '200',
      radius: '25',
      time: "#{Time.now.to_i * 1000},#{(Time.now.beginning_of_day + 5.day).to_i * 1000}",
      fields: "venue"
    }.merge(attributes))["results"]
  end

  private
  def path
    "/2/open_events"
  end
end
