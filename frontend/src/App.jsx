import { Link, Route, Routes, } from 'react-router-dom';
import Home from './home/Home.jsx';
import Login from './signup/Login.jsx';
import Signup from './signup/Signup.jsx';
import Profile from './home/Profile.jsx';
import CreatePage from './home/CreatePage.jsx';
import History from './home/History.jsx';
import Message from './message/Message.jsx';
import Chat from './message/Chat.jsx';
import ComputersCanvas from './ComputersCanvas.jsx';

const App = () => {
  return (
<div >
<Routes className="text-white-500">
  <Route path='/' element={<ComputersCanvas></ComputersCanvas>}></Route>
  <Route path='/peter' element={<Home></Home>}></Route>
  <Route path='/Signup' element={<Signup></Signup>}></Route>
  <Route path='/login' element={<Login></Login>}></Route>
  <Route path='/home' element={<Home></Home>}></Route>
  <Route path='/profile/:username' element={<Profile></Profile>}></Route>
  <Route path='/createpost' element={<CreatePage></CreatePage>}></Route>
  <Route path='/history' element={<History></History>}></Route>
   <Route path="/messages" element={<Message />} />
  <Route path="/messages/:id" element={<Chat/>} />
</Routes>
    </div>
  )
}
export default App
