// 1. Import modules
const express = require("express"); 	//เรียกใช้ Express สำหรับสร้าง Web Server และ API
const proxy = require("express-http-proxy"); //proxy")	เรียกใช้ Library สำหรับส่ง Request ไปยัง Server อื่น
const path = require("path");//เรียกใช้เครื่องมือจัดการตำแหน่งไฟล์และ Folder
const bodyParser = require("body-parser"); //เรียกใช้ Middleware สำหรับอ่านข้อมูลจาก Request Body
const app = express();//สร้าง Express Application เก็บไว้ในตัวแปร app

const host = "127.0.0.1";
const port = 3000;
const userServicePort = 3001;
const productServicePort = 3002;

const userServiceUrl = `http://${host}:${userServicePort}`;
const productServiceUrl = `http://${host}:${productServicePort}`; //ใช้ Template Literal โดยใช้เครื่องหมาย Backtick ` และ ${} เพื่อแทรกค่าตัวแปรลงในข้อความ

// 2. Middleware: แสดง frontend และอ่านข้อมูลที่ส่งมาก่อนเข้า route
app.use(express.static(path.join(__dirname, "../public")));//ใช้เปิดให้ Browser เข้าถึงไฟล์ Frontend ใน Folder public ได้ เช่น HTML, CSS, JavaScript และรูปภาพ
app.use(bodyParser.json());//ใช้แปลงข้อมูล JSON ที่ส่งมาจาก Frontend ให้ Express สามารถอ่านได้ผ่าน req.body
app.use(bodyParser.urlencoded({ extended: false })); //ช้แปลงข้อมูลที่ส่งมาในรูปแบบ URL-encoded Form ให้สามารถอ่านผ่าน req.body ได้

// 3. ส่งต่อคำขอไปยังแต่ละ service ตามตัวอย่างในบทเรียน
app.use("/users", proxy(userServiceUrl));
app.use("/products", proxy(productServiceUrl));

// 4. เปิด API Gateway
app.listen(port, host, () => {
  console.log(`API Gateway: http://${host}:${port}`);
});
