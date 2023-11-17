import axios from 'axios';
import { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext';


const LoginPage = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUser} =useContext(UserContext)
  async function LoginSubmit(ev) {
    // ev.preventDefault();
    // try {
    //     const response = await fetch('http://localhost:4000/login', {
    //             method: 'POST',
    //             body: JSON.stringify({email,password}),
    //             headers: {'Content-Type': 'application/json'},
    //             credentials: 'include', 
                
    //         });
    //     if(response.ok) {
    //         setRedirect(true);
    //         alert ('Login Successful');
    //         setTimeout(() => {
    //             window.location.reload();
    //           },1);
    //     }
    //     else{
    //         alert ('wrong credentials')
    //     }
    // }
    // catch(error) {
    //     // message: error.message;
    //     alert('Login Failed. Please try again Later');
    // }
    ev.preventDefault();
    try {
      const {data} = await axios.post('/login', {email,password});
      setUser(data);
      alert('Login successful');
      setRedirect(true);
    } catch (e) {
      alert('Login failed');
    }
}
if(redirect) {
    return <Navigate to={'/'} />
}
  return (
    <div className='mt-4 grow flex items-center justify-around'>
        <div className='mb-64'>
            <h1 className='text-4xl text-center mb-4'>Login</h1>
            <form className='max-w-lg mx-auto ' 
            onSubmit={LoginSubmit} >
                <input type='email' 
                placeholder='your@email.com' 
                value={email} 
                onChange={ev => setEmail(ev.target.value)}/>
                <input type='password' placeholder='password'
                value={password} 
                onChange={ev => setPassword(ev.target.value)}/>
                <button className='primary'>Login</button>
                <div className='text-center py-2 text-gray-500'>
                    Do not have an account? 
                    <Link className='underline text-black' 
                    to={"/register"}>Register now</Link> 
                </div>
            </form>
        </div>
    </div>
  )
}

export default LoginPage 