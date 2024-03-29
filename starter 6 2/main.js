const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description: Praying that this works LMAO
 *
 * Created Date: 02/19/2024
 * Author: Aiden Denike
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

// IOhandler.unzip(zipFilePath, pathUnzipped)
//   .then(() => {
//     return IOhandler.readDir(pathUnzipped);
//   })
//   .then((filePaths) => {
//     return Promise.all(filePaths.map((filePath) => IOhandler.grayscale(filePath, pathProcessed)));
//   })
//   .then(() => {
//     console.log("Processing completed successfully.");
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

(async () => {
    try {
      await IOhandler.unzip(zipFilePath, pathUnzipped);
      console.log("Zip file decompressed successfully!");
  
      const pngFiles = await IOhandler.readDir(pathUnzipped);
      console.log("Found PNG files:", pngFiles);
  
      await IOhandler.grayscale(pathUnzipped, pathProcessed);
      console.log("PNG files converted to grayscale successfully!");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  })();