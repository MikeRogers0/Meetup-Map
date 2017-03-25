Rails.application.routes.draw do
  

  root controller: :home, action: :index

  resource :events, only: [] do
    get :nearby, defaults: { format: :xml }
  end
end
