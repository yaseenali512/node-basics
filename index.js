////////////////////// Files ///////////////////////
// const fs = require("fs");

// fs.readFile("newFile.txt", "utf-8", (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(data);
// });

// const data = fs.readFileSync("newFile.txt", "utf-8");
// console.log(data);

// const textin = fs.readFile("./txt/input.txt", "utf-8");

// fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(data);
// });

// console.log(textin);

// fs.writeFileSync(
//   "./txt/output.txt",
//   `This is what we know about the avocado: ${textin}.\nCreated on ${Date.now()}`
// );

////////////////////// Server ///////////////////////

const { constants } = require("buffer");
const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate.js");
const tempOverview = fs.readFileSync("./templates/template-overview.html", "utf-8");
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const tempProduct = fs.readFileSync("./templates/template-product.html", "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // const pathName = req.url;

  //Overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");

    // console.log(cardsHtml);

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //Product
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    //API
  } else if (pathname === "/api") {
    fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
      const productData = JSON.parse(data);
      res.end(data);
    });

    //Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });

    res.end("<h5> Page not found </h5>");
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("Listening to requests on port 5000");
});
