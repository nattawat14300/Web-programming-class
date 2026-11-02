var express = require('express');
var app = express();
let http = require('http');
var hostname = 'localhost';
var port = 3001;
var fs = require('fs/promises');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('your id', socket.id);


    socket.on('send_to_all', async(data) => {
        console.log(`[All] จาก ${socket.id}:`, data);
        // Complete this
        // บันทึกข้อความลงไฟล์ log.json
        await readandWriteFile(data);


        // Complete this
        // ส่งข้อความไปยังทุกคน รวมถึงตัวเองด้วย โดยใช้ io.emit และ event name เป็น 'message_received' พร้อมกับส่งข้อมูลเป็น object ที่มี time, user, text
        io.emit('message_received', data);


    });
})

app.get('/readlog', async(req, res) => {
    // Complete this
    // ใช้ fs.readFile เพื่ออ่านไฟล์ log.json และส่งผลลัพธ์กลับไปยัง client ในรูปแบบ JSON
    try {
        const logs = await readFile();
        res.json(logs);
    } catch (error) {
        console.error("Error reading log:", error);
        res.status(500).json({ error: "Failed to read log" });
    }

});

const readFile = async() => {
    // Complete this 
    // ใช้ fs.readFile เพื่ออ่านไฟล์ log.json 
    try {

        // อ่าน log.json
        const data = await fs.readFile(
            __dirname + '/log.json',
            'utf8'
        );

        // แปลง JSON string เป็น JavaScript object
        return JSON.parse(data);

    } catch (error) {

        console.error("Error reading file:", error);

        return [];

    }

};

const writeFile = async(data) => {
    // Complete this
    // ใช้ fs.writeFile เพื่อเขียนข้อมูลลงไฟล์ log.json 
    // โดยแปลง object เป็น JSON string ด้วย JSON.stringify(data, null, 2) เพื่อให้มีการจัดรูปแบบที่อ่านง่าย
    try {

        // แปลง object เป็น JSON string
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(__dirname + '/log.json', jsonData, 'utf8');

    } catch (error) {
        console.error("Error writing file:", error);
    }


};

const readandWriteFile = async(new_msg) => {
    // Complete this
    // ใช้ readFile() เพื่ออ่านไฟล์ log.json และเก็บผลลัพธ์ไว้ในตัวแปร logs
    // เพิ่ม new_msg ลงใน logs
    // ใช้ writeFile(logs) เพื่อเขียนข้อมูลกลับไปยังไฟล์ log.json
    // update log.json with new message
    try {
        const logs = await readFile();
        logs.push(new_msg);
        await writeFile(logs);
    } catch (error) {
        console.error("Error updating log.json: ", error);
    }


};


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});