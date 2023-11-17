import React, { useContext, useEffect, useState } from 'react'
import {differenceInCalendarDays} from 'date-fns';
import axios from 'axios';
import {Navigate} from 'react-router'
import { UserContext } from '../context/UserContext';

// eslint-disable-next-line react/prop-types
const BookingWidget = ({place}) => {
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [numberOfGuests,setNumberOfGuests] = useState(1);
  const [name,setName] = useState('');
  const [mobile,setMobile] = useState('');
  const [redirect,setRedirect] = useState('');
  const {user} = useContext(UserContext);
  useEffect(() => {
    if(user){
      setName(user.name);
    }
  },[user])
  let numberOfDays= 0;
  if(checkIn && checkOut){
    numberOfDays = differenceInCalendarDays(new Date(checkOut),new Date(checkIn));
  }
  async function bookThisPlace(){
  const response = await axios.post('/bookings', {
    checkIn,checkOut,numberOfGuests,name,mobile,
    place:place._id,
    price:numberOfDays * place.price,
  });
  const bookingId = response.data._id;
  setRedirect(`/account/bookings/${bookingId}`);
}


if(redirect){
    return <Navigate to={redirect} />
  }
  return (
    <div>
        <div className='bg-gray-100 shadow shadow-black p-4 rounded-2xl'>
                        <div className='text-2xl text-center'>
                        Price: ₹{place.price} / per night
                        </div>
                       <div className='border rounded-2xl mt-4'>
                       <div className='flex'>
                       <div className='py-3 px-4 '>
                            <label className='font-semibold'>Check in: </label><br/>
                            <input type='date' 
                            value={checkIn} onChange={ev =>{setCheckIn(ev.target.value)}}></input>
                        </div>
                        <div className=' py-3 px-4  border-l'>
                            <label className='font-semibold'>Check out: </label><br/>
                            <input type='date' 
                            value={checkOut} onChange={ev =>{setCheckOut(ev.target.value)}}></input>
                        </div>
                       </div>
                       <div className=' py-3 px-4 border-l'>
                            <label>Number of Guests:</label>
                            <input type='number' 
                            value={numberOfGuests} 
                            onChange={ev=> setNumberOfGuests(ev.target.value)}></input>
                        </div>
                        {numberOfDays>0 && (
                          <div className=''>
                            <div className=' py-3 px-4 border-l'>
                            <label>Your Full Name:</label>
                            <input type='text'
                            placeholder='John Doe' 
                            value={name} 
                            onChange={ev=> setName(ev.target.value)}></input>
                            <label>Mobile Number:</label>
                            <input type='tel'
                            placeholder='+91-XXXXXXXXXX' 
                            value={mobile} 
                            onChange={ev=> setMobile(ev.target.value)}></input>
                        </div>
                          </div>
                        )}
                       </div>
                        <button onClick={bookThisPlace} className='primary mt-4'> 
                        Book Place  
                        {
                          numberOfDays > 0 && (
                            <span> ₹{numberOfDays * place.price}</span>
                          )
                          
                        }
                        </button>
                    </div>
    </div>
  )
}

export default BookingWidget