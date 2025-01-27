const xml2js = require("xml2js");
const formidable = require("formidable");

async function getData(req) {
  return new Promise((resolve, reject) => {
    let data = Buffer.alloc(0);

    req.on("data", (chunk) => {
      data = Buffer.concat([data, chunk]);
    });

    req.on("end", () => {
      resolve(data.toString());
      console.log(data.toString());
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

async function getFormData(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    let newFields = {};

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        for (let filed of Object.entries(fields)) {
          newFields[filed[0]] = filed[1][0];
        }
        resolve({ fields: newFields, files });
      }
    });
  });
}

async function getXMLdata(req) {
  return new Promise((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      try {
        xml2js.parseString(data, { explicitArray: false }, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
            console.log(result);
          }
        });
      } catch (error) {
        console.error("Error parsing XML data:", error);
        reject(error);
      }
    });

    req.on("error", (err) => {
      console.error("Error reading request data:", err);
      reject(err);
    });
  });
}

async function getTextOrJsonData(req) {
  const type = req.headers["content-type"] || req.headers["Content-Type"];
  return new Promise((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      if (type.includes("text")) resolve(data);
      else {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
        console.log(jsonData);
      }
    });

    req.on("error", (err) => {
      console.error("Error reading request data:", err);
      reject(err);
    });
  });
}

module.exports = { getData, getFormData, getTextOrJsonData, getXMLdata };
