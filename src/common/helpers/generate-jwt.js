import jwt from "jsonwebtoken";

export const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.TOKEN_KEY,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) {
          console.error(err);
          reject("Failed to generate JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};
