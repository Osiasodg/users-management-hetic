import http from "node:http";
import { Json } from "./src/utils/responses.js";
import { listUsers } from "./src/users/users.controlers.js";

const listener = (request, response) => {


    if (request.url === "/users") {
    return listUsers(request, response);
  }

  return Json(response, 404, {
    message: "Not found",
  });
  // json(response, 200, {
  //   message: "API works!!"
  // }) ; 

  // response.writeHead(200, { "content-type": "text/plain" });
  // response.end("hello word\n");
};

const server = http.createServer(listener);
server.listen(3000);

console.log("server running at http://127.0.0.1:3000/");


