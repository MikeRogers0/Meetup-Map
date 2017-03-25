Rails.application.routes.draw do
  

  root controller: :home, action: :index

  get :kml, controller: :home, action: :kml, defaults: { format: :kml }
end
