import React, { useEffect, useState } from 'react';
import { User } from '../types/UserTypes';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams();
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`http://localhost:3000/user/${id}`);
      const data = await response.json();
      setUser(data);
    }
    fetchUser();
  }, [id]);
  return (
    <div>
      {user ? (
        <div>
          Why this?
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Profile;
