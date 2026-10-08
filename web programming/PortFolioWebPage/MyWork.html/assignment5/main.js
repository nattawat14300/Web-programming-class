// ========================================================
// Assignment 5: JavaScript Post and Reply
// ให้นักศึกษาเขียนโค้ด JavaScript เพื่อจัดการการ Post และ Clear ข้อความ
// ========================================================

window.onload = setupFunction;

function setupFunction() {
let name = document.getElementById("top");
name.innerHTML = "Welcome to the forum";
document.getElementById("button1").onclick  = postFunction;
document.getElementById("button2").onclick = clearFunction;

}

// สร้างตัวแปรนับลำดับการโพสต์ชื่อว่า postCount และกำหนดค่าเริ่มต้นเป็น 0
let postcount = 0;


function postFunction() {
    // TODO: ให้นักศึกษาเขียนโค้ดในส่วนนี้
     // 1. อ่านค่าข้อความจาก textarea (id="message")
    // 2. นำข้อความไปใส่ในแต่ละกล่องตามลำดับ:
    //    - ครั้งที่ 1 ใส่ใน id="topic"
    //    - ครั้งที่ 2 ใส่ใน id="reply1"
    //    - ครั้งที่ 3 ใส่ใน id="reply2"
    // 3. เคลียร์ข้อความใน textarea ให้ว่างหลังจากโพสต์
    // 4. เพิ่มค่า postCount
    let message = document.getElementById("message").value;

    if (message == "")
    {
       return;
    }

    if (postcount == 0){
        document.getElementById("topic").innerHTML = message;
    }
    else if (postcount == 1){
        document.getElementById("reply1").innerHTML = message;
    }
    else if(postcount == 2){
        document.getElementById("reply2").innerHTML = message;
    }

    postcount++;
    document.getElementById("message").value = "";
   
}

function clearFunction() {
    // TODO: ให้นักศึกษาเขียนโค้ดในส่วนนี้
    // 1. ล้างข้อความใน id="topic", id="reply1", id="reply2"
    // 2. ล้างข้อความใน textarea (id="message")
    // 3. รีเซ็ตตัวแปร postCount กลับเป็นค่าเริ่มต้น
    document.getElementById("topic").innerHTML= "";
    document.getElementById("reply1").innerHTML = "";
    document.getElementById("reply2").innerHTML = "";
    document.getElementById("massage").value = "";
    postcount = 0;
}
