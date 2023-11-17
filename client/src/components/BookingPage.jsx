import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import AddressLink from './AddressLink';
import PlaceGallery from './PlaceGallery';
import BookingDates from './BookingDates';
import axios from 'axios';

const BookingPage = () => {
    const {id} = useParams();
    const [booking,setBooking] = useState(null);

    useEffect(() => {
      if (id) {
        axios.get('/bookings').then(response => {
          const foundBooking = response.data.find(({_id}) => _id === id);
          if (foundBooking) {
            setBooking(foundBooking);
          }
        });
      }
    }, [id]);
  
    if(!booking)
    {
      return '';
    }
  return (
 
    <div className='my-8'>  
      <h1 className='text-3xl'>{booking.place.title}</h1>
      <AddressLink>{booking.place.address}</AddressLink>
      <div className='bg-gray-200 p-6 my-6 rounded-2xl items-center flex justify-between'>
        <div>
        <h2 className='text-2xl mb-4'>Your Booking Information</h2>
        <BookingDates booking={booking}/>
        </div>
        <div className='bg-primary p-6 text-white rounded-2xl'>
          <div >Total Amount</div>
          <div className='text-3xl'>₹{booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
      </div>
  )
}

export default BookingPage