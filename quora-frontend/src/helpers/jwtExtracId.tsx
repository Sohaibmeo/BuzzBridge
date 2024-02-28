import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

export default function useJwtExtractId() {
  const [cookies] = useCookies(['jwt']);

  const getToken = () => {
    if (cookies.jwt) {
      const decodedToken = jwtDecode(cookies.jwt);
      if (decodedToken && decodedToken.sub !== undefined) {
        return parseInt(decodedToken.sub, 10);
      } else {
        return 0;
      }
    }
    return 0;
  };

  return getToken();
}
