import path from "path";

const nextConfig = {
  // (optional) if you plan to dockerize:
  // output: "standalone",
  outputFileTracingRoot: path.join(__dirname), // pin to Wellspring-AI folder
};

export default nextConfig;
