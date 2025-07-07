export default {
  transform: {
    "^.+\\.js$": "babel-jest", // Use Babel to transform JavaScript files
  },
  testEnvironment: "node",
  transformIgnorePatterns: ["node_modules/(?!(get-stream|pdfkit)/)"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
