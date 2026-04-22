const serverless = require("serverless-http");
const app = require("./src/app");

module.exports.handler = serverless(app, {
  request: (req, event) => {
    // remove /default from path
    if (event.requestContext && event.requestContext.stage) {
      const stage = event.requestContext.stage;
      req.url = req.url.replace(`/${stage}`, "") || "/";
    }
  },
});
