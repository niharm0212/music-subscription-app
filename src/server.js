require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

// Only run server locally or on ECS
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
