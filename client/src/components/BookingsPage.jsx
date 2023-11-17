import { useEffect, useState } from 'react'
import AccountNav from './AccountNav'
import {format} from 'date-fns';
import { differenceInCalendarDays } from 'date-fns/esm/fp';
import { Link } from 'react-router-dom';
import BookingDates from './BookingDates';
import axios from 'axios';
import Image from './Image';
const BookingsPage = () => {
  const[bookings,setBookings] = useState([]);
  useEffect(() => {
    axios.get('/bookings').then(response => {
      setBookings(response.data);
    });
  }, []);
  return (
    <div>
      <AccountNav/>
      <div>
        {bookings?.length > 0 && bookings.map(booking => (
          <Link to={`/account/bookings/${booking._id}`} key={booking._id} className='flex gap-4 bg-gray-200 rounded-2xl overflow-hidden'>
            <div>
            {booking.place.addedPhotos.length > 0 && (
            <Image className='object-cover w-48 h-32 rounded-2xl' src={booking.place.addedPhotos[0]}/>
            )}
            </div>
            <div className='py-3 pr-3 grow '>
              <h2 className='text-xl'>{booking.place.title}</h2>
              <div className=' flex  border-t border-gray-300 mt-2 py-2'></div>
              <BookingDates booking={booking} className="text-gray-500 text-xl"/>
              <div className='text-xl flex gap-1 '>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
                Total amount: ₹{booking.price}
              </div>
          </div>
          </Link>
        ))}
         </div>
      </div>
  )
}

export default BookingsPage