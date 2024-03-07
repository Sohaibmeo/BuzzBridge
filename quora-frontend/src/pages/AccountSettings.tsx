import { useEffect, useState } from 'react';
import useJwtExtractId from '../helpers/jwtExtracId';
import UpdateUserAccountForm from '../components/Forms/UpdateUserAccountForm';
import { Button, Grid } from '@mui/material';
import UserCard from '../components/Cards/UserCard';
import useCustomAxios from '../helpers/customAxios';
import { User } from '../types/UserTypes';

const AccountSettings = () => {
  const currentUser = useJwtExtractId();
  const [activeTab, setActiveTab] = useState('password');
  const [user, setUser] = useState<User | null>(null);
  const axiosInstance = useCustomAxios();
  async function fetchUser() {
    try {
      const response = await axiosInstance.get(`/user/${currentUser}`);
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container justifyContent="center" spacing={1} columnGap={2} >
      <Grid item xs={1} display={'flex'} flexDirection={'column'} rowGap={1} >
        <Button
          variant={activeTab === 'password' ? 'contained' : 'text'}
          color={'inherit'}
          onClick={() => setActiveTab('password')}
        >
          Update Password
        </Button>
        <Button
          variant={activeTab === 'email' ? 'contained' : 'text'}
          color={'inherit'}
          onClick={() => setActiveTab('email')}
        >
          Update Email
        </Button>
      </Grid>
      <Grid item xs={4} display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{backgroundColor:'white'}}>
        {activeTab && (
          <UpdateUserAccountForm user={user} activeTab={activeTab} />
        )}
      </Grid>
      <Grid item xs={2.5} sx={{backgroundColor:'white'}}>
        {user && <UserCard user={user} hover />}
      </Grid>
    </Grid>
  );
};

export default AccountSettings;
