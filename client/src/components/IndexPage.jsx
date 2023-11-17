import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import axios from 'axios';
import Image from './Image';

const IndexPage = () => {
  const [places,setPlaces] = useState([]);
  useEffect(()=> {
    axios.get("/places")
      .then(res => {
        setPlaces([...res.data]);
      })
      .catch(err => console.error(err));
  },[])
  return (
    <div className='mt-8  gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '>
        {places.length > 0 && places.map(place => (
          <div key={place._id}>
            <Link to={'/place/'+place._id}>
            <div className='bg-gray-500 mb-2 flex rounded-2xl'>
            {place.addedPhotos?.[0] && (
               <Image className='rounded-2xl object-cover aspect-square' src={place.addedPhotos?.[0]}/>
            )}
            </div>
            
            <h2 className='font-bold'>{place.address}</h2>
            <h3 className='text-sm text-gray-500'>{place.title}</h3>
            <div className='mt-1'>
             <span className='font-bold'>₹{place.price}</span> /Night
            </div>
            </Link>
          </div>
        ))}
  </div> 
  )
}

export default IndexPage;