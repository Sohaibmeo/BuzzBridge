import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import useCustomAxios from '../../helpers/customAxios';
import { User } from '../../types/UserTypes';

const UpdateUserAccountForm = ({
  user,
  activeTab,
}: {
  user: User | null;
  activeTab: string;
}) => {
  const [formData, setFormData] = useState();
  const axiosInstance = useCustomAxios();
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted + ' + formData);
    try {
      const response = axiosInstance.put(`/user/${user?.id}`, formData);
      console.log(response);
    } catch (error) {
      console.error(error);
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
          <TextField
            label="Old Password"
            type="password"
            name="oldPassword"
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
            name="password"
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
          <TextField
            label="Confirm Password"
            type="password"
            name="password"
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </>
      )}
      <Button type="submit" variant="contained" color="primary" >
        Update
      </Button>
    </form>
  );
};

export default UpdateUserAccountForm;
