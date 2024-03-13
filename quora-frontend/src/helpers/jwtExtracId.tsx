import { jwtDecode } from 'jwt-decode';

export default function getExtractedJwt(jwt: any) {
  console.log('jwt', jwt)
  const getToken = () => {
    if (jwt && jwt.sub) {
      const decodedToken = jwtDecode(jwt);
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
