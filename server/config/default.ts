export default {
  port: 3000,
  dbUri:
    process.env.NODE_ENV === "development"
      ? "mongodb://localhost:27017/sociomedia"
      : process.env.DB_URI,
  saltWorkFactor: 10,
  smtp: {
    user: "h5uvprxuv247zcm3@ethereal.email",
    host: "smtp.ethereal.email",
    port: 587,
    pass: "DhugEJfecDxfVssYDE",
    secure: false,
  },
  fromEmail: "sociomedia@app.com",
  accessTokenPrivateKey: "",
  refreshTokenPrivateKey: "",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
};
