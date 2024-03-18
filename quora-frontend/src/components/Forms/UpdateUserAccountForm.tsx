import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import customAxios from '../../helpers/customAxios';
import { User } from '../../types/UserTypes';
import { useAlert } from '../Providers/AlertProvider';
import { useUser } from '../Providers/UserProvider';

const UpdateUserAccountForm = ({
  user,
  activeTab,
}: {
  user: User | null;
  activeTab: string;
}) => {
  const [formData, setFormData] = useState<any>();
  const { showAlert } = useAlert();
  const axiosInstance = customAxios();
  const { expireCurrentUserSession } = useUser();
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    switch (activeTab) {
      case 'password':
        try {
          const { confirmPassword, ...data } = formData;
          if (confirmPassword === formData.newPassword) {
            await axiosInstance.patch(`/user/password`, {
              ...data,
              username: user?.username,
            });
            showAlert('success', 'Password updated');
          } else {
            showAlert('error', 'Passwords do not match');
          }
        } catch (error: any) {
          showAlert('error', 'Unauthorized Request made');
          if (error.response.status === 401) {
            expireCurrentUserSession();
          }
        }
        break;
      case 'email':
        try {
          const { email, confirmEmail } = formData;
          if (email === confirmEmail) {
            await axiosInstance.patch(`/user/${user?.id}`, {
              email,
            });
            showAlert('success', 'Email updated');
          } else {
            throw new Error('Emails do not match');
          }
        } catch (error: any) {
          if (error.message === 'Emails do not match') {
            showAlert('error', 'Emails do not match');
          } else if (
            error.response &&
            error.response.data &&
            error.response.data.statusCode === 401
          ) {
            showAlert('error', 'Unauthorized Request made');
          } else if (error.response && error.response.data) {
            showAlert('error', error.response.data.message);
          } else {
            showAlert('error', error);
          }
          if (error.response.status === 401) {
            expireCurrentUserSession();
          }
        }
        break;
      default:
        break;
    }
  };
  return (
    <form
      onSubmit={handleFormSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 10,
        width: 'fit-content',
      }}
    >
      {activeTab === 'password' && (
        <>
          <Typography variant="h5" color={'inherit'} textAlign={'center'}>
            Update Password
          </Typography>
          <TextField
            label="Old Password"
            type="password"
            name="password"
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          <TextField
            label="New Password"
            type="password"
            name="newPassword"
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </>
      )}
      {activeTab === 'email' && (
        <>
          <Typography variant="h5" color={'inherit'} textAlign={'center'}>
            Update Email
          </Typography>
          <TextField
            label="Email"
            type="email"
            name="email"
            defaultValue={user?.email}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          {formData?.email && (
            <TextField
              label="Confirm Email"
              type="email"
              name="confirmEmail"
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          )}
        </>
      )}
      <Button type="submit" variant="contained" color="primary">
        Update
      </Button>
    </form>
  );
};

export default UpdateUserAccountForm;
