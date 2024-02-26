import { useEffect, useState } from 'react';
import { User } from '../types/UserTypes';
import useJwtExtractId from '../helpers/jwtExtracId';
import UserCard from '../components/Cards/UserCard';
const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const currentUser = useJwtExtractId();
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`http://localhost:3000/user/${currentUser}`);
      const data = await response.json();
      setUser(data);
    }
    fetchUser();
  }, [currentUser]);
  return <UserCard user={user} />;
};

export default Profile;
