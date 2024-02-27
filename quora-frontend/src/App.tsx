import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import HomePage from './pages/Home';
import PrimarySearchAppBar from './components/Navbar/navbar';
import { AlertProvider } from './components/Providers/AlertProvider';
import { CookiesProvider, useCookies } from 'react-cookie';
import Question from './pages/Question';
import Topic from './pages/Topic';
import Profile from './pages/Profile';
import NoMatch from './pages/NoMatch';

function App() {
  const [cookies] = useCookies(['jwt']);
  return (
    <BrowserRouter>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <AlertProvider>
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
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<NoMatch />} />
              </>
            )}
          </Routes>
        </AlertProvider>
      </CookiesProvider>
    </BrowserRouter>
  );
}

export default App;
