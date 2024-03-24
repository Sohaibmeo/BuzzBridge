import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./pages/Home";
import PrimarySearchAppBar from "./components/Common/Navbar";
import Question from "./pages/Question";
import Topic from "./pages/Topic";
import Profile from "./pages/Profile";
import NoMatch from "./pages/NoMatch";
import AccountSettings from "./pages/AccountSettings";
import AllTopic from "./pages/AllTopic";
import { useUser } from "./components/Providers/UserProvider";
import SignUp from "./pages/SignUp";

function App() {
  const { getCurrentUser } = useUser();
  const currentUser = getCurrentUser();
  return (
    <>
      <PrimarySearchAppBar />
      <Routes>
        {!currentUser ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup/:token" element={<SignUp />} />
            <Route path="/signup-reset-password/:token" element={<SignUp forgetPassword />} />
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
