// 1. ส่วนแสดงผล: สลับฟอร์ม Login / Register
function setMode(mode) {
  const form = document.getElementsByName("form")[0];
  form.reset();
  document.getElementById("message").textContent = "";
  document.getElementById("nameField").hidden = mode !== "register";
  form.name.required = mode === "register";
  form.password.autocomplete = mode === "register" ? "new-password" : "current-password";
  document.getElementById("title").textContent = mode === "register" ? "สมัครสมาชิก" : "เข้าสู่ระบบ";
  document.getElementById("submit").textContent = mode === "register" ? "Register" : "Login";
  document.getElementById("loginTab").classList.toggle("active", mode === "login");
  document.getElementById("registerTab").classList.toggle("active", mode === "register");
  form.onsubmit = mode === "register" ? register : login;
}

// 2. สมัครสมาชิก: ส่งข้อมูลไปยัง User Service ผ่าน Gateway
async function register(event) {
  event.preventDefault();
  const form = document.getElementsByName("form")[0];
  const button = document.getElementById("submit");
  button.disabled = true;
  try {
    const output = await fetch("/users/register", {
      // ส่งข้อมูลไปยัง User Service ผ่าน Gateway
      // complete the code here



    });
    const result = await output.json();
    if (output.ok) setMode("login");
    document.getElementById("message").textContent = result.message;
  } catch {
    document.getElementById("message").textContent = "ไม่สามารถติดต่อ server ได้";
  } finally {
    button.disabled = false;
  }
}

// 3. Login: เบราว์เซอร์รับ Cookie จาก User Service
async function login(event) {
  event.preventDefault();
  const form = document.getElementsByName("form")[0];
  const button = document.getElementById("submit");
  button.disabled = true;
  try {
    const output = await fetch("/users/login", {
      // ส่งข้อมูลไปยัง User Service ผ่าน Gateway
    //  complete the code here


    });
    const result = await output.json();
    document.getElementById("message").textContent = result.message;
    if (result.access) await loadProducts();
  } catch {
    document.getElementById("message").textContent = "ไม่สามารถติดต่อ server ได้";
  } finally {
    button.disabled = false;
  }
}

// 4. ตรวจ session เมื่อเปิดหน้าเว็บหรือรีเฟรช
async function checkAuth() {
  try {
    const output = await fetch("/users/session", {
    // ส่ง request ไปยัง User Service ผ่าน Gateway เพื่อให้ User Service ตรวจ session และส่งผลกลับมา
    // complete the code here


    });
    const result = await output.json();
    if (result.access) await loadProducts();
  } catch {
    document.getElementById("message").textContent = "ไม่สามารถติดต่อ server ได้";
  }
}

// 5. ดึงสินค้า: Product Service ตรวจ session ก่อนอ่านฐานข้อมูล
async function loadProducts() {
  const output = await fetch("/products", {
  //  ส่ง request ไปยัง Product Service ผ่าน Gateway เพื่อให้ Product Service ตรวจ session และส่งผลกลับมา
  // complete the code here




  });
  const products = await output.json();
  if (!output.ok) {
    document.getElementById("message").textContent = products.message;
    return;
  }
  const grid = document.querySelector(".products");
  grid.replaceChildren();
  // จับคู่ชื่อสินค้าจากฐานข้อมูลกับไฟล์รูปใน public/images
  const productImages = {
    "เสื้อยืด MDT": "/images/shirt.png",
    "หมวกแก๊ป": "/images/cap.png",
    "กระเป๋าผ้า": "/images/tote.png",
  };
  for (const product of products) {
    const card = document.createElement("article");
    if (productImages[product.name]) {
      const image = document.createElement("img");
      image.src = productImages[product.name];
      image.alt = product.name;
      image.className = "product-image";
      card.append(image);
    }
    const title = document.createElement("h2");
    title.textContent = product.name;
    const price = document.createElement("p");
    price.textContent = Number(product.price).toLocaleString("th-TH") + " บาท";
    card.append(title, price);
    grid.append(card);
  }
  document.getElementById("auth").hidden = true;
  document.getElementById("shop").hidden = false;
  document.getElementsByName("form")[0].reset();
}

// 6. Logout: server ลบ session และสั่งให้เบราว์เซอร์ลบ Cookie
async function logout() {
  const button = document.getElementById("logout");
  button.disabled = true;
  try {
    const output = await fetch("/users/logout", {
      // ส่ง request ไปยัง User Service ผ่าน Gateway เพื่อให้ User Service ลบ session และสั่งให้เบราว์เซอร์ลบ Cookie
      // complete the code here


    });
    const result = await output.json();
    if (!output.ok) {
      document.getElementById("shopMessage").textContent = result.message;
      return;
    }
    if (!result.access) {
      document.getElementById("shop").hidden = true;
      document.getElementById("auth").hidden = false;
      document.querySelector(".products").replaceChildren();
      document.getElementById("shopMessage").textContent = "";
      setMode("login");
      document.getElementById("message").textContent = result.message;
    }
  } catch {
    document.getElementById("shopMessage").textContent = "ไม่สามารถติดต่อ server ได้";
  } finally {
    button.disabled = false;
  }
}

// 7. เชื่อมปุ่มกับฟังก์ชัน เหมือนตัวอย่างในบทเรียน
window.onload = function () {
  setMode("login");
  document.getElementById("loginTab").onclick = function () { setMode("login"); };
  document.getElementById("registerTab").onclick = function () { setMode("register"); };
  document.getElementById("logout").onclick = logout;
  checkAuth();
};
