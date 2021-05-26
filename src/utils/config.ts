const prodConfig = {
  API_ENDPOINT: "/api/v1",
};

const devConfig = {
  API_ENDPOINT: "http://localhost:3000/api/v1",
};

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

export default config;
