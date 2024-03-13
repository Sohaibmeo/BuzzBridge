import { Route, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import HomePage from './pages/Home';
import PrimarySearchAppBar from './components/Navbar/navbar';
import Question from './pages/Question';
import Topic from './pages/Topic';
import Profile from './pages/Profile';
import NoMatch from './pages/NoMatch';
import AccountSettings from './pages/AccountSettings';
import { useEffect } from 'react';
import { useUser } from './components/Providers/UserProvider';

function App() {
  const [cookies] = useCookies(['jwt']);
  const { handleCurrentUserLogin } = useUser();
  useEffect(
    () => {
      if (cookies.jwt) {
        handleCurrentUserLogin(cookies.jwt);
      }
    },
    // eslint-disable-next-line
    [cookies.jwt],
  );
  return (
    <>
      <PrimarySearchAppBar />
      <Routes>
        {!cookies.jwt ? (
          <>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />
          </>
        ) : (
          <>
            <Route path="/question/:id" element={<Question />} />
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
