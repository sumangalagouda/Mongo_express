Event Booking API

A RESTful API built with Node.js, Express, and MongoDB for managing event bookings — supports create, read, update, delete, search, and filter operations.

⚙️ Setup

Clone & install
    git clone https://github.com/yourusername/event-booking-api.git
    cd event-booking-api
    npm install
    
Add .env file
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/

Run server
    node server.js

Server: http://localhost:3000

📡 Endpoints
Method	Endpoint	Description
POST	        /api/bookings	          Add booking
GET          	/api/bookings	          Get all bookings
GET	          /api/bookings/:id      	Get booking by ID
PUT	          /api/bookings/:id	      Update booking
DELETE	      /api/bookings/:id	      Delete booking
GET	          /api/bookings/search?email=	Search by email
GET	          /api/bookings/filter?event=	Filter by event
