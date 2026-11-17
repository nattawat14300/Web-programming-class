// 1. ส่วนแสดงผล: สลับฟอร์ม Login / Register
function setMode(mode) {
    const form = document.getElementById("form");

    form.reset();
    document.getElementById("message").textContent = "";
    document.getElementById("nameField").hidden = mode !== "register";
    form.name.required = mode === "register";
    form.password.autocomplete =
        mode === "register" ? "new-password" : "current-password";
    document.getElementById("title").textContent =
        mode === "register" ? "สมัครสมาชิก" : "เข้าสู่ระบบ";
    document.getElementById("submit").textContent =
        mode === "register" ? "Register" : "Login";
    document.getElementById("loginTab").classList.toggle("active", mode === "login");
    document.getElementById("registerTab").classList.toggle("active", mode === "register");
    form.onsubmit = mode === "register" ? register : login;
}


// 2. สมัครสมาชิก
async function register(event) {
    event.preventDefault();//คือคำสั่งใช้ป้องกันไม่ให้ ส่ง form ปกติ และ Refresh เมื่อกดปุ่ม Register

    const form = document.getElementById("form");
    const button = document.getElementById("submit");

    button.disabled = true;//ป็นการปิดการใช้งานปุ่ม Submit ชั่วคราว เพื่อป้องกันไม่ให้ผู้ใช้กดส่งข้อมูลซ้ำระหว่างที่ระบบกำลังส่ง Request ไปยัง Server

    try {
        const output = await fetch("/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: form.name.value,
                email: form.email.value,
                password: form.password.value
            }),
            credentials: "include"
        });

        const result = await output.json();

        if (output.ok) {
            setMode("login");
        }

        document.getElementById("message").textContent =
            result.message;

    } catch {
        document.getElementById("message").textContent =
            "ไม่สามารถติดต่อ server ได้";

    } finally {
        button.disabled = false;
    }
}


// 3. Login
async function login(event) {
    event.preventDefault();

    const form = document.getElementById("form");
    const button = document.getElementById("submit");

    button.disabled = true;

    try {
        const output = await fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: form.email.value,
                password: form.password.value
            }),
            credentials: "include"
        });

        const result = await output.json();

        document.getElementById("message").textContent =
            result.message;

        if (result.access) {
            await loadProducts();
        }

    } catch {
        document.getElementById("message").textContent =
            "ไม่สามารถติดต่อ server ได้";

    } finally {
        button.disabled = false;
    }
}


// 4. ตรวจสอบ Session เมื่อเปิดหรือ Refresh หน้าเว็บ
async function checkAuth() {
    try {
        const output = await fetch("/users/session", {
            method: "GET",
            credentials: "include"
        });

        const result = await output.json();

        if (result.access) {
            await loadProducts();
        }

    } catch {
        document.getElementById("message").textContent =
            "ไม่สามารถติดต่อ server ได้";
    }
}


// 5. ดึงข้อมูลสินค้า
async function loadProducts() {
    const output = await fetch("/products", {
        method: "GET",
        credentials: "include"
    });

    const products = await output.json();

    if (!output.ok) {
        document.getElementById("message").textContent =
            products.message;
        return;
    }

    const grid = document.querySelector(".products");

    grid.replaceChildren();

    // จับคู่ชื่อสินค้ากับรูปภาพ
    const productImages = {
        "เสื้อยืด MDT": "/images/shirt.png",
        "หมวกแก๊ป": "/images/cap.png",
        "กระเป๋าผ้า": "/images/tote.png"
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
        price.textContent =
            Number(product.price).toLocaleString("th-TH") + " บาท";

        card.append(title, price);
        grid.append(card);
    }

    document.getElementById("auth").hidden = true;
    document.getElementById("shop").hidden = false;

    document.getElementById("form").reset();
}


// 6. Logout
async function logout() {
    const button = document.getElementById("logout");

    button.disabled = true;

    try {
        const output = await fetch("/users/logout", {
            method: "POST",
            credentials: "include"
        });

        const result = await output.json();

        if (!output.ok) {
            document.getElementById("shopMessage").textContent =
                result.message;
            return;
        }

        if (!result.access) {
            document.getElementById("shop").hidden = true;
            document.getElementById("auth").hidden = false;

            document.querySelector(".products").replaceChildren();

            document.getElementById("shopMessage").textContent = "";

            setMode("login");

            document.getElementById("message").textContent =
                result.message;
        }

    } catch {
        document.getElementById("shopMessage").textContent =
            "ไม่สามารถติดต่อ server ได้";

    } finally {
        button.disabled = false;
    }
}


// 7. เชื่อมปุ่มกับฟังก์ชัน
window.onload = function() {
    setMode("login");

    document.getElementById("loginTab").onclick = function() {
        setMode("login");
    };

    document.getElementById("registerTab").onclick = function() {
        setMode("register");
    };

    document.getElementById("logout").onclick = logout;

    checkAuth();
};