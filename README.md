# Aero - Room Booking Platform

A full-stack room booking application built with MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to book accommodations and hosts to list their properties.

## Features

- User authentication (Register/Login)
- Property listing with multiple image uploads
- Property search and filtering
- Booking management system
- User dashboard
- Responsive design
- Secure payment integration
- Property image management with Cloudinary

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Bcrypt for password hashing

## Environment Variables

### Backend (.env)
```
DATABASE_URL=your_mongodb_connection_string
PORT=4000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:4000/api
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/sachin1999/Aero.git
```

2. Install dependencies for backend
```bash
cd api
npm install
```

3. Install dependencies for frontend
```bash
cd client
npm install
```

4. Start the backend server
```bash
cd api
npm run dev
```

5. Start the frontend development server
```bash
cd client
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/register` - Register new user
- POST `/api/login` - Login user
- POST `/api/logout` - Logout user
- GET `/api/profile` - Get user profile

### Places
- GET `/api/places` - Get all places
- GET `/api/places/:id` - Get specific place
- POST `/api/places` - Create new place
- PUT `/api/places` - Update place
- GET `/api/user-places` - Get user's places

### Bookings
- POST `/api/bookings` - Create new booking
- GET `/api/bookings` - Get user's bookings

### Image Upload
- POST `/api/upload-by-link` - Upload image via link
- POST `/api/uploads` - Upload images from device

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## Contact

Your Name - [@sachin1999](https://github.com/sachin1999)

Project Link: [https://github.com/sachin1999/Aero](https://github.com/sachin1999/Aero)
