// [week9.pdf: หน้า 15 - ตัวอย่าง callback]
// console.log('i am first');

// setTimeout(() => {
//   console.log('i am second');
// }, 0);

// console.log('i am third');

// [week9.pdf: หน้า 16 - Arrow Function]
// arrow function
// function hello(){
//     console.log("Hello");
// }
// hello()

// hello = () => {
//     console.log("Hello");
// }
// hello()

// [week9.pdf: หน้า 17 - Arrow function with parameters]
// hello = (message) => {
//     console.log("Hello "+message);
// }
// hello("Kejkaew")

// [week9.pdf: หน้า 18-20 - Create server (HTTP Module)]
//Hello world
// const http = require('http');
// const hostname = 'localhost';
// const port = 3000;
// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write("Hello world");
//     res.end();
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at   http://${hostname}:${port}/`);
// });

// [week9.pdf: หน้า 25-26 - File system: read file]
// file system : read file

// const fs=require('fs');
// fs.readFile('test.txt', (err, data) => {
// 	if (err) 
// 		throw err;
		
// 	console.log("Content :  " + data);
// });

// [week9.pdf: หน้า 27-28 - File system: write file]
// file system : write file
// const fs =  require('fs');
// const content= "this is the content in the file";
// fs.writeFile('message.txt', content , (err) => {
// 	if (err) 
// 		throw err;
// 	console.log('saved!');
// });

// [week9.pdf: หน้า 29-30 - File system: append file]
// file system : append file
// const fs = require('fs');
// const new_data = "This data will be appended at the end of the file.";
// fs.appendFile('message.txt', new_data , (err) => {
// 	if(err) 
// 		throw err;
// 	console.log('The new_content was appended successfully');
// });

// [week9.pdf: หน้า 31 - File system: delete file]
// file system : delete file
// const fs = require('fs');
// const filename = 'message.txt';
// fs.unlink(filename, (err) => {
// 	if (err) 
// 		throw err;
// 	console.log('File deleted successfully');
// });

// [week9.pdf: หน้า 32-33 - File system: check file exist]
// file system : check file exist
// const fs = require('fs');
// const path = './test.txt';
// fs.access(path, fs.F_OK, (err) => {
//   if (err) {
//     console.log("File not found");
//     return;
//   }else{
//       console.log("Exist!");
//   }
// });

// [week9.pdf: หน้า 38 - ตัวอย่าง ที่ไม่ใช้ promises: อ่านและเขียน file ใหม่]
// No Promises
// const fs=require('fs');
// fs.readFile('test.txt', (err, data) => {
// 	if (err) 
// 		throw err;
// 	else{
//         fs.writeFile('message.txt', data , (err) => {
//             if (err) 
//                 throw err;
//             console.log('saved!');
//         });
//     }
// });

// [week9.pdf: หน้า 39 - ตัวอย่าง ที่ใช้ promises: อ่านและเขียน file ใหม่ (เนื้อหาทฤษฎีหน้า 35-37)]
// Promises
// const fs = require('fs');
// const readData = () => {
//     return new Promise((resolve, reject) => {
//         fs.readFile('test.txt', (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data);
//             }
//         });
//     });
// }

// const writeData = (data) => {
//     return new Promise((resolve, reject) => {
//         fs.writeFile('message.txt', data, (err) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve("saved!");
//             }
//         });
//     });
// }

// readData()
//     .then((data) => {
//         return writeData(data);
//     })
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((err) => {
//         console.error(err);
//     }); 

// [week9.pdf: หน้า 40-42 - การใช้ Promises ด้วย Async/Await ร่วมกับ fs/promises (ตัวอย่างการอ่านและเขียนไฟล์ใหม่)]

// const fs = require('fs/promises');
// async function readData() {
//     try {
//         const data = await fs.readFile('test.txt');
//         return data;
//     } catch (err) {
//         throw err;
//     }
// }

// async function writeData(data) {
//     try {
//         await fs.writeFile('message.txt', data);
//         return "saved!";
//     } catch (err) {
//         throw err;
//     }
// }

// async function readWriteData() {
//     try {
//         const data = await readData();
//         const result = await writeData(data);
//         console.log(result);
//     } catch (err) {
//         console.error(err);
//     }
// }

// readWriteData(); 

// [week9.pdf: หน้า 43-44 - Read and Write JSON file (และผลลัพธ์บน Terminal หน้า 44)]

// const fs = require('fs/promises');
// const readData = async () => {
//     try {
//         const data = await fs.readFile('jfile.json', 'utf8');
//         console.log(data);
//         return data;
//     } catch (err) {
//         throw err;
//     }
// }

// const writeData = async (data) => {
//     try {
//         await fs.writeFile('new_jfile.json', data);
//         return "saved!";
//     } catch (err) {
//         throw err;
//     }
// }

// const readWriteData = async () => {
//     try {
//         const data = await readData();
//         const result = await writeData(data);
//         console.log(result);
//     } catch (err) {
//         console.error(err);
//     }
// }

// readWriteData();
