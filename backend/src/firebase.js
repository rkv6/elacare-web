import admin from "firebase-admin";

export const getDb = () => admin.firestore();
export const getAuth = () => admin.auth();

export const verifyToken = async (token) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await verifyToken(token);
    req.userId = decodedToken.uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
