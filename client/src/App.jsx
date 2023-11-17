import './App.css'
import {Route,Routes} from "react-router-dom";
import IndexPage from './components/IndexPage';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import Register from './components/Register';
import axios from 'axios';
import PlacesFormPage from './components/PlacesFormPage';
import { UserContextProvider } from './context/UserContext';
import ProfilePage from './components/ProfilePage';
import BookingPage from './components/BookingPage';
import PlacesPage from './components/PlacesPage';
import PlacePage from './components/PlacePage';
import BookingsPage from './components/BookingsPage';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;
function App() {
  return (
    <UserContextProvider >
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<IndexPage/>} />
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/account/' element={<ProfilePage/>}/>
          <Route path='/account/places' element={<PlacesPage/>}/>
          <Route path='/account/places/new' element={<PlacesFormPage/>}/>
          <Route path='/account/places/:id' element={<PlacesFormPage/>}/>
          <Route path='/place/:id' element={<PlacePage/>}/>
          <Route path='/account/bookings' element={<BookingsPage/>}/>
          <Route path='/account/bookings/:id' element={<BookingPage/>}/>

        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App;
