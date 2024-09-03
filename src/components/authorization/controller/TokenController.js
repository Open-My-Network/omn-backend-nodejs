let verifyToken = async (req, res) => {
    try {
      let { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          status: 400,
          message: "Refresh token is required",
        });
      }
      jwt.verify(refreshToken, "secret", (err, decoded) => {
        if (err) {
          return res.status(403).json({
            status: 403,
            message: "Invalid refresh token",
          });
        }
  
        // Generate a new access token
        const { id, email, user_nicename } = decoded;
        const newAccessToken = jwt.sign(
          { id, email, user_nicename },
          "secret",
          { expiresIn: "15m" }
        );
  
        return res.status(200).json({
          status: 200,
          accessToken: newAccessToken,
        });
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: `Server error : ${error}`,
      });
    }
  };

  export default verifyToken;