//TODO: token verification for protected routes
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // 1. Get the token from the request
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  let token = null;

  if (authHeader) {
    token = authHeader.replace(/^[Bb]earer\s+/, "").trim();
  }

  token =
    token || req.headers["x-access-token"] || req.query.token || req.body.token;

  if (typeof token === "string") {
    token = token.trim();
    if (/^['\"].*['\"]$/.test(token)) {
      token = token.slice(1, -1).trim();
    }
  }

  if (!token || token === "null" || token === "undefined") {
    return res
      .status(401)
      .json({ error: "Missing auth token. Use Authorization: Bearer <token>" });
  }

  if (typeof token === "string" && token.split(".").length !== 3) {
    console.error("JWT malformed token received:", token);
    return res.status(403).json({
      error:
        "Malformed JWT token. Use the raw accessToken string returned by login, without quotes, braces, or angle brackets.",
      tokenPreview: token.slice(0, 20) + (token.length > 20 ? "..." : ""),
    });
  }

  // 2. Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res
        .status(403)
        .json({ error: "Invalid or expired token.", details: err.message });
    }

    // 3. Attach user info to the request object for use in the route
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
