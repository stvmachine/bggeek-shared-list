const prodConfig = {
  API_ENDPOINT: "https://bbgeek-shared-list.vercel.app/api/v1",
};

const devConfig = {
  API_ENDPOINT: "http://localhost:3000/api/v1",
};

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

export default config;
