// =============================================================================

// MDT312 Assignment 6 register.js

// Modernized: ES6 (const/let), event.preventDefault(), and localStorage

// =============================================================================

window.onload = pageLoad;

function pageLoad() {
  const form = document.getElementById("myRegister");

  if (form) {
    form.onsubmit = validateForm;
  } // ตัวอย่างการอ่านข้อมูลเมื่อเปิดหน้าเว็บ (ถ้ามี Query String หรือ localStorage)

  loadStoredData();
}

function validateForm(event) {
  const errorMsg = document.getElementById("errormsg");

  const username = document.forms["myRegister"]["username"].value.trim();

  const passwords = document.forms["myRegister"]["password"];

  const password = passwords[0].value;

  const retypePassword = passwords[1].value; // 1. ตรวจสอบว่า Password ทั้ง 2 ช่องตรงกันหรือไม่ ถ้าไม่ตรงกันให้แจ้งเตือน และให้return false

  if (password !== retypePassword) {
    alert("Password ทั้ง 2 ช่องไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");

    return false;
  } // 2. เคลียร์ข้อความแจ้งเตือนถ้าผ่านการตรวจสอบ

  errorMsg.innerHTML = "";


// 3. บันทึกข้อมูลลงใน localStorage ทีละตัว
  const savedUsername = localStorage.setItem("userUsername");
  const savedPassword = localStorage.setItem("userPassword");

// เพื่อความปลอดภัย: รหัสผ่านไม่ปรากฏบน Browser Address Bar และ Browser History

alert("ลงทะเบียนสำเร็จ! ระบบบันทึกข้อมูลเรียบร้อย กำลังไปที่หน้า Login");

// 4. นำทางไปหน้า login.html
event.preventDefault();
window.location.href = "login.html";
return true;
}