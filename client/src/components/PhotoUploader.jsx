import { useState } from 'react'
import axios from 'axios';
import Image from './Image';

const PhotoUploader = ({addedPhotos, onChange}) => {
    const [photoLink,setPhotoLink] = useState('');
    async function addPhotoByLink(ev) {
        ev.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link', {link: photoLink});
        onChange(prev => {
        return [...prev, filename];
        });
        setPhotoLink('');
    }
    function uploadPhoto(ev){
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0 ;i <files.length;i++)
        {
            data.append('photos', files[i]);
        }
        axios.post('/uploads', data, {
            headers: {'Content-Type' : 'multipart/form-data'}
        }).then(response => {
            const {data:filenames} = response;
            onChange((prev) => {
                return [...prev, ...filenames];
            });
        }) 
    }
    function removePhoto(ev,filename){
        ev.preventDefault();
        onChange([...addedPhotos.filter(photo=> photo !== filename)])
    }
    function setAsFirst(ev,filename){
        ev.preventDefault();
        onChange([filename,...addedPhotos.filter(photo=> photo !== filename)]);
    }
  return (
    <div>
        <h2 className='text-xl mt-4'>Photos</h2>
                    <div className='flex gap-2'>
                        <input type='text' value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} placeholder={'Add Using a link ...jpg'}/>
                        <button onClick={addPhotoByLink} className='bg-gray-200 px-4 rounded-2xl '>Add Photo</button>
                    </div>

                    <div className='grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-2'>
                         {addedPhotos.length > 0 && addedPhotos.map((link) =>(
                            <div className='relative h-32 flex' key={link}>
                                <Image className='rounded-2xl w-full object-cover' src={link} />
                                <button onClick={ev => removePhoto(ev,link)} className='absolute bottom-1 right-1 text-white bg-black p-1 cursor-pointer bg-opacity-50 rounded-2xl px-3 py-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                </button>
                                <button onClick={ev => setAsFirst(ev,link)} className='absolute bottom-1 left-1 text-white bg-black p-1 cursor-pointer bg-opacity-50 rounded-2xl px-3 py-2'>
                                {link === addedPhotos[0] && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {link !== addedPhotos[0] && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                
                                </button>
                            </div>
                         ))}
                         <label className='cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600'>
                         <input type='file' multiple className='hidden' onChange={uploadPhoto}/>
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                         </svg>
                            upload from device
                         </label>
                    </div>
    </div>
  )
}

export default PhotoUploader