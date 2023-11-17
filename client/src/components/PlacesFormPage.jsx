import { useEffect, useState } from 'react'
import Perks from './Perks';
import PhotoUploader from './PhotoUploader';
import AccountNav from './AccountNav';
import { Navigate, useParams } from 'react-router';
import axios from 'axios';
const PlacesFormPage = () => {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [description,setDescription] = useState(''); 
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [perks,setPerks] = useState('');
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [redirect,setRedirect] = useState(false);
    const [price,setPrice] = useState(1000);
    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get('/places/'+id)
        .then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.addedPhotos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        });
    },[id]);
    async function savePlace(ev){
      ev.preventDefault();
      const placeData = {
                  title, address, addedPhotos,
                  checkIn,checkOut, description, 
                  perks, extraInfo, maxGuests,price
      }
      if(id) {
        //update
        const response = await fetch('http://localhost:4000/places', {
          method: 'PUT',
          body: JSON.stringify({id,...placeData}),
          headers: {'Content-Type': 'application/json'},
          credentials: 'include', 
          
      });
      if(response.ok) {
          alert ('Place Updated Successful');
          setRedirect(true);
      }
  }
      else{
        //new place
        const response = await fetch('http://localhost:4000/places', {
          method: 'POST',
          body: JSON.stringify({...placeData}),
          headers: {'Content-Type': 'application/json'},
          credentials: 'include', 
          
      });
      if(response.ok) {
          alert ('Place Added Successful');
          setRedirect(true);
      }
  }
      }
      
   if(redirect){
    return <Navigate to={'/account/places'} />
   }
  return (
    <div>
      <AccountNav/>
      <form onSubmit={savePlace}>
                    <h2 className='text-xl mt-4'>Title</h2>
                    <input type='text' value={title} onChange={ev => setTitle(ev.target.value)} placeholder='title'/>
                    <h2 className='text-xl mt-4'>Address</h2>
                    <input type='text' value={address} onChange={ev => setAddress(ev.target.value)} placeholder='address'/>
                    <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                    <h2 className='text-2xl mt-4'>Description</h2>
                    <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder='Describe the place'></textarea>
                    <h2 className='text-2xl mt-4'>Perks</h2>
                    <div className=' grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-5'>
                     <Perks selected={perks} onChange={setPerks}/>       
                    </div>
                    <h2 className='text-2xl mt-4'>Extra info</h2>
                    <p className='text-gray-500 text-sm'>house rules ,etc</p>
                    <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}/>
                    <h2 className='text-2xl mt-4'>Check-in & Check-out times</h2>
                    <div className='grid gap-2 grid-cols-2 md:grid-cols-4'>
                        <div>
                            <h3 className='mt-2 -mb-1'>Check-in Time</h3>
                            <input type='text' value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder='12:00'></input>
                        </div>
                        <div>
                            <h3 className='mt-2 -mb-1'>Check-out Time</h3>
                            <input type='text' value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder='22:00'></input>
                        </div>
                        <div>
                            <h3 className='mt-2 -mb-1'>Max number of guests </h3>
                            <input type='number' value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)}></input>
                        </div>
                        <div>
                            <h3 className='mt-2 -mb-1'>Price per night </h3>
                            <input type='number' value={price} onChange={ev => setPrice(ev.target.value)}></input>
                        </div>
                    </div>
                        <button className='primary my-4'>Save</button>
                </form>
    </div>
  )
}

export default PlacesFormPage