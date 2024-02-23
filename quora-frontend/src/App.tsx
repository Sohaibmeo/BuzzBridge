import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import HomePage from './pages/Home'
import ResponsiveAppBar from './components/Navbar/navbar'
import { AlertProvider } from './components/Providers/AlertProvider';
import { CookiesProvider, useCookies } from 'react-cookie';

function App() {
  const [cookies] = useCookies(['jwt']);
  return (
    <BrowserRouter>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <AlertProvider>
          <ResponsiveAppBar />
          <Routes>
            {!cookies.jwt? 
            <>
            <Route path='/signup' element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            </> : 
            <>
              <Route path="/" element={<HomePage />} />
            </>
            }
            {/* <Route path="*" element={<NoMatch />} /> */}
          </Routes>
        </AlertProvider>
      </CookiesProvider>
    </BrowserRouter>
  );
}

export default App;