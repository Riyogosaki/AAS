import { Link, Route, Routes } from 'react-router-dom';
import Home from './home/Home.jsx';
import Login from './signup/Login.jsx';
import Signup from './signup/Signup.jsx';
import Profile from './home/Profile.jsx';
import CreatePage from './home/CreatePage.jsx';
import History from './home/History.jsx';
import Message from './message/Message.jsx';
import Chat from './message/Chat.jsx';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile/:username' element={<Profile />} />
        <Route path='/createpost' element={<CreatePage />} />
        <Route path='/history' element={<History />} />
        <Route path='/messages' element={<Message />} />
        <Route path='/messages/:id' element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
