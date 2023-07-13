const fs = require("fs");
const http = require("http");

const url = process.argv[2];
const filePath = process.argv[3];

// Create an HTTP request to retrieve the resource
const request = http.get(url, (response) => {
  // Check if the response status code is 200 (OK)
  if (response.statusCode !== 200) {
    console.error(`Error: Failed to retrieve resource. Status Code: ${response.statusCode}`);
    return;
  }

  let fileData = "";

  // Accumulate the response data
  response.on("data", (chunk) => {
    fileData += chunk;
  });

  // After receiving the entire response, write it to a local file
  response.on("end", () => {
    fs.writeFile(filePath, fileData, (error) => {
      if (error) {
        console.error(`Error: Failed to write file. ${error.message}`);
        return;
      }

      const fileSize = Buffer.byteLength(fileData);
      console.log(`Downloaded and saved ${fileSize} bytes to ${filePath}`);
    });
  });
});

// Handle any errors that occur during the HTTP request
request.on("error", (error) => {
  console.error(`Error: Failed to retrieve resource. ${error.message}`);
});
