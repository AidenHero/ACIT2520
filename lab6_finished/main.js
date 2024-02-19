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

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => {
    // After unzipping, read the directory and get paths of PNG files
    return IOhandler.readDir(pathUnzipped);
  })
  .then((filePaths) => {
    // Process each PNG file and save to the grayscaled directory
    return Promise.all(filePaths.map((filePath) => IOhandler.grayscale(filePath, pathProcessed)));
  })
  .then(() => {
    console.log("Processing completed successfully.");
  })
  .catch((error) => {
    console.error("Error:", error);
  });