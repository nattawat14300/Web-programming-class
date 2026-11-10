// 1. Import modules
const express = require("express");
const proxy = require("express-http-proxy");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const host = "127.0.0.1";
const port = 3000;
const userServicePort = 3001;
const productServicePort = 3002;

const userServiceUrl = `http://${host}:${userServicePort}`;
const productServiceUrl = `http://${host}:${productServicePort}`;

// 2. Middleware: แสดง frontend และอ่านข้อมูลที่ส่งมาก่อนเข้า route
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 3. ส่งต่อคำขอไปยังแต่ละ service ตามตัวอย่างในบทเรียน
app.use("/users", proxy(userServiceUrl));
app.use("/products", proxy(productServiceUrl));

// 4. เปิด API Gateway
app.listen(port, host, () => {
  console.log(`API Gateway: http://${host}:${port}`);
});
