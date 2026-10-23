import jwt from "jsonwebtoken";

// checks that the user is logged in
export const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded has { userId, role, iat, exp }
    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized, token invalid or expired" });
  }
};

// blocks viewers from create, update and delete actions
export const editorOnly = (req, res, next) => {
  if (req.user.role === "viewer") {
    return res.status(403).json({ message: "Viewers cannot do this action" });
  }

  next();
};