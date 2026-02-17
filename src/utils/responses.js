
export function Json(response, status, data){
  response.writeHead(status, { "content-type": "text/plain" });
  response.end(JSON.stringify(data));
};

