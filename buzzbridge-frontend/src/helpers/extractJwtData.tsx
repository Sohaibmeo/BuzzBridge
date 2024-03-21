import { jwtDecode } from "jwt-decode"

export const extractJWTData = (token: string): any => {
    const data = jwtDecode(token);
    const { exp, iat, ...rest } = data;
    return rest;
}