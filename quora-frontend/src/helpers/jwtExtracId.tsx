import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {jwtDecode} from 'jwt-decode';

export default function useJwtExtractId() {
  const [cookies] = useCookies(['jwt']);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (cookies.jwt) {
      const decodedToken = jwtDecode(cookies.jwt);
      if (decodedToken.sub !== undefined) {
        setUserId(parseInt(decodedToken.sub, 10));
      } else {
        setUserId(null);
      }
    }
  }, [cookies.jwt]);

  return userId;
}
