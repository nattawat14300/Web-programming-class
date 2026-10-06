const fs = require('fs/promises'); //เป็นการนำ File System Module ของ Node.js เข้ามาใช้ และเลือกใช้เวอร์ชันที่เป็น Promise-based API
const http = require('http'); //เป็นการนำ HTTP Module ของ Node.js มาใช้ HTTP Module ใช้สำหรับสร้าง HTTP Server
//และสอนว่า HTTP Module สามารถใช้ createServer() เพื่อสร้าง HTTP Server ที่รอ Request จาก Client แล้วส่ง Response กลับไปได้
const hostname = 'localhost';
const port = 3000;
//  async ทำงานแบบไม่หยุดรอ (Non-blocking) เมื่อสั่งโหลดข้อมูล โปรแกรมจะข้ามไปทำหน้าจออื่นหรือคำสั่งอื่นต่อได้เลย พอข้อมูลโหลดเสร็จค่อยกลับมาแสดง
// complete the code here //  req Request คือข้อมูลคำขอที่ส่งมาจาก Client ในกรณีนี้ Client ก็คือ Browser //// res Response คือสิ่งที่ Server จะส่งกลับไปให้ Client
const server = http.createServer(async(req, res) => { //สร้าง HTTP Server และกำหนดว่าถ้ามี Client ส่ง Request เข้ามา Server จะทำอะไร ประกาศ Arrow Function ที่เป็น Async Function
    res.writeHead(200, { 'Content-Type': 'text/html' });//คือสิ่งที่ Server จะส่งกลับไปให้ Client 200 คือ HTTP Status , Code Content-Type บอก Browser ว่า: ข้อมูลที่ Server กำลังจะส่งกลับมาเป็น HTML
    const data = await main(); //เรียก Function main() และรอให้ทำงานเสร็จ จากนั้นเอาผลลัพธ์ที่ได้เก็บไว้ในตัวแปร data
    res.write(`<pre >${JSON.stringify(data, null, 2)}</pre>`); //ส่งข้อมูลจาก Server กลับไปให้ Client, pre เป็น HTML Tag ที่ทำให้ข้อความที่อยู่ข้างในยังคงรูปแบบการเว้นบรรทัดและช่องว่างไว้ จึงเหมาะกับการแสดง JSON
    res.end();

});

// complete the code here
const readJsonFile = async() => {//ชื่อสื่อความหมายว่า อ่านไฟล์ JSON
    try { //ใช้สำหรับลองทำคำสั่งที่อาจเกิด Error
        const data = await fs.readFile('cloth1.json', 'utf8'); //เพราะถ้าไฟล์ไม่มี หรือชื่อไฟล์ผิด ก็จะเกิด Error , utf8 บอกให้ Node.js อ่านข้อมูลออกมาเป็น ข้อความ (String)
        return JSON.parse(data); //รอให้การอ่านไฟล์เสร็จก่อน แล้วจึงนำผลลัพธ์มาเก็บใน data

    } catch (error) { //ถ้าเกิด Error ใน try จะกระโดดมาทำงานตรงนี้
        console.error('Error reading JSON file:', error); 
        throw error;
    }
}

// complete the code here
// จำนวนเสื้อผ้าตามที่กำหนด
const editJsonFile = (data) => {
    const n_stock = [12, 13, 50, 22, 55, 87, 12, 29, 10]

    for (let i = 0; i < data.length; i++) {
        data[i].stock = n_stock[i];
    }
    return data;

}

// complete the code here
const writeJsonFile = async(data) => {
    try {
        await fs.writeFile('new_cloth.json', JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('Error writing JSON file:', error);
        throw error;
    }
}

// complete the code here
const main = async() => {
    try {
         const data = await readJsonFile();
        const editedData = editJsonFile(data);
        const result = await writeJsonFile(editedData);
        return result;
    } catch (error) {
        console.error('Error in main function:', error);
        return { error: error.message };
    }


}

server.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/`);
});