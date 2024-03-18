import { Route, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Login from './pages/Login';
import HomePage from './pages/Home';
import PrimarySearchAppBar from './components/Common/Navbar';
import Question from './pages/Question';
import Topic from './pages/Topic';
import Profile from './pages/Profile';
import NoMatch from './pages/NoMatch';
import AccountSettings from './pages/AccountSettings';
import AllTopic from './pages/AllTopic';

function App() {
  const [cookies] = useCookies(['jwt']);
  return (
    <>
      <PrimarySearchAppBar />
      <Routes>
        {!cookies.jwt ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />
          </>
        ) : (
          <>
            <Route path="/question/:id" element={<Question />} />
            <Route path="/alltopics" element={<AllTopic />} />
            <Route path="/topic/:id" element={<Topic />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/account" element={<AccountSettings />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NoMatch />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
