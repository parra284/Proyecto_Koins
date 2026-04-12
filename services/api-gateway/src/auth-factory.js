const { createRemoteJWKSet, jwtVerify } = require('jose');

const createVerifier = () => {
  // Opción A: Proveedor Externo (OIDC/JWKS)
  if (process.env.JWKS_URL) {
    const JWKS_SET = createRemoteJWKSet(new URL(process.env.JWKS_URL));
    return async (token) => {
      return await jwtVerify(token, JWKS_SET, {
        issuer: process.env.AUTH_ISSUER
      });
    };
  }

  // Opción B: Secreto Local (HS256) - Útil para testing o servicios propios
  if (process.env.JWT_SECRET) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    return async (token) => {
      return await jwtVerify(token, secret);
    };
  }

  throw new Error("Configuración de autenticación no encontrada. Define JWKS_URL o JWT_SECRET.");
};

module.exports = createVerifier;