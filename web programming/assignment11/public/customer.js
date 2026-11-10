// ==========================================
// CUSTOMER.JS
// หน้าที่: ระบบสั่งอาหารและติดตามสถานะสำหรับลูกค้า
// ==========================================


// เก็บข้อมูลหลักที่ใช้ภายในหน้า Customer
const state = {
    menu: [], // รายการเมนูอาหารทั้งหมด
    orders: [], // รายการออเดอร์ทั้งหมด
    clearing: false, // สถานะกำลัง Clear โต๊ะ
    selected: null, // ID ของเมนูที่ลูกค้าเลือก
    quantity: 1, // จำนวนอาหารที่ต้องการสั่ง
    table: 1, // หมายเลขโต๊ะที่ลูกค้าเลือก
    sending: false, // สถานะกำลังส่งออเดอร์
};


// กำหนดข้อความแสดงสถานะของออเดอร์
const labels = {
    preparing: 'Preparing · รับออเดอร์แล้ว',
    cooking: 'Cooking · กำลังปรุง',
    done: 'Done · พร้อมเสิร์ฟ',
};


// Function: money()
// หน้าที่: แปลงตัวเลขให้เป็นรูปแบบสกุลเงินบาท
const money = (value) =>
    new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB'
    }).format(Number(value));


// Function: node()
// หน้าที่: สร้าง HTML Element ด้วย JavaScript
function node(tag, className, text) {
    const el = document.createElement(tag);

    // กำหนดชื่อ Class ให้ Element
    if (className) el.className = className;

    // กำหนดข้อความภายใน Element
    if (text !== undefined) el.textContent = text;

    return el;
}


// Function: foodIcon()
// หน้าที่: เลือก Emoji ให้เหมาะสมกับประเภทอาหาร
function foodIcon(name = '') {
    return /ต้ม|แกง|ซุป/.test(name) ?
        '🍲' :
        /ผัด|กะเพรา/.test(name) ?
        '🍛' :
        /น้ำ/.test(name) ?
        '🥤' :
        '🍽️';
}


// Function: notify()
// หน้าที่: แสดงข้อความแจ้งเตือนให้ลูกค้าทราบ
// error = true หมายถึงเป็นข้อความแจ้งเตือนข้อผิดพลาด
function notify(text, error = false) {
    const el = document.getElementById('message');

    el.hidden = false;
    el.className = 'notice' + (error ? ' error' : '');
    el.textContent = text;
}


// ตัวแปรสำหรับจัดการ Socket.IO และการโหลดข้อมูล
let socket;
let refreshVersion = 0;
let clearTarget = null;


// Function: normalized()
// หน้าที่: ปรับสถานะ pending ให้เป็น preparing
function normalized(order) {
    return order.status === 'pending' ? 'preparing' : order.status;
}


// Function: badge()
// หน้าที่: สร้างป้ายแสดงสถานะของอาหาร
function badge(status) {
    return node('span', 'badge ' + status, labels[status] || status);
}


// Function: empty()
// หน้าที่: แสดงข้อความเมื่อไม่มีข้อมูล
function empty(target, text) {
    const el = node('div', 'empty');

    el.append(
        node('b', '', '♨'),
        node('span', '', text)
    );

    target.append(el);
}


// Function: selectedMenu()
// หน้าที่: ค้นหาเมนูอาหารที่ลูกค้าเลือกจาก state
function selectedMenu() {
    return state.menu.find((item) => item.id === state.selected);
}


// Function: renderSummary()
// หน้าที่: แสดงสรุปรายการอาหาร จำนวน ราคา และหมายเลขโต๊ะ
function renderSummary() {
    const item = selectedMenu();

    document.getElementById('selected-name').textContent = item ?
        item.name :
        'เลือกอาหารจากเมนูด้านบน';

    document.getElementById('selected-price').textContent = item ?
        `${money(item.price)} / จาน` :
        'คลิกเมนูที่อยากทานเพื่อเริ่มสั่ง';

    // แสดงจำนวนอาหารที่เลือก
    document.getElementById('quantity').textContent = state.quantity;

    // คำนวณราคารวมของอาหาร
    document.getElementById('total').textContent = money(
        item ? (Math.round(Number(item.price) * 100) * state.quantity) / 100 : 0
    );

    // แสดงหมายเลขโต๊ะ
    document.getElementById('summary-table').textContent =
        `โต๊ะ ${String(state.table).padStart(2, '0')}`;

    // ปิดปุ่มสั่งอาหารเมื่อไม่มีเมนู หรือกำลังส่งข้อมูลหรือ Clear โต๊ะ
    document.getElementById('submit').disabled = !item || state.sending || state.clearing;

    // ปิดปุ่มลดจำนวนเมื่อจำนวนอาหารเหลือ 1
    document.getElementById('minus').disabled = state.quantity <= 1;

    // ปิดปุ่มเพิ่มจำนวนเมื่อจำนวนอาหารถึง 20
    document.getElementById('plus').disabled = state.quantity >= 20;
}


// Function: renderMenu()
// หน้าที่: แสดงเมนูอาหารทั้งหมดบนหน้าเว็บ
function renderMenu() {
    const grid = document.getElementById('menu');

    // ล้างรายการเมนูเดิมก่อนสร้างใหม่
    grid.replaceChildren();

    // แสดงจำนวนเมนูทั้งหมด
    document.getElementById('menu-count').textContent =
        `${state.menu.length} เมนู`;

    // วนลูปแสดงเมนูอาหารแต่ละรายการ
    for (const item of state.menu) {

        // สร้างปุ่มเมนูอาหาร
        const button = node(
            'button',
            'menu-card' + (state.selected === item.id ? ' selected' : '')
        );

        button.type = 'button';

        // กำหนดสถานะการเลือกเมนู
        button.setAttribute(
            'aria-pressed',
            String(state.selected === item.id)
        );

        // กำหนดข้อความสำหรับช่วยในการเข้าถึง
        button.setAttribute(
            'aria-label',
            `เลือก ${item.name} ${money(item.price)}`
        );

        // เพิ่ม Emoji และชื่ออาหาร
        button.append(
            node('span', 'food-art', foodIcon(item.name)),
            node('strong', '', item.name)
        );

        // สร้างส่วนแสดงราคา
        const bottom = node('span', 'menu-bottom');

        bottom.append(
            node('span', '', money(item.price)),
            node('b', '', state.selected === item.id ? '✓' : '+')
        );

        button.append(bottom);

        // เมื่อคลิกเมนู ให้บันทึก ID ของเมนูที่เลือก
        button.onclick = () => {
            state.selected = item.id;

            // อัปเดตเมนูและสรุปรายการ
            renderMenu();
            renderSummary();
        };

        // เพิ่มปุ่มเมนูลงในหน้าเว็บ
        grid.append(button);
    }

    // หากไม่มีเมนู ให้แสดงข้อความแจ้งเตือน
    if (!state.menu.length) {
        grid.append(node('p', 'empty', 'ยังไม่มีเมนูในขณะนี้'));
    }

    renderSummary();
}


// Function: renderCustomerOrders()
// หน้าที่: แสดงออเดอร์ของโต๊ะที่ลูกค้าเลือก
// พร้อมแสดงสถานะการเตรียมอาหาร
function renderCustomerOrders() {
    const mine = document.getElementById('customer-orders');

    // ล้างรายการออเดอร์เดิม
    mine.replaceChildren();

    // กรองออเดอร์ให้เหลือเฉพาะโต๊ะที่เลือก
    const tableOrders = state.orders.filter(
        (order) => order.table_no === state.table
    );

    // แสดงปุ่ม Clear พร้อมหมายเลขโต๊ะ
    document.getElementById('clear-table').textContent =
        `⌫ Clear โต๊ะ ${String(state.table).padStart(2, '0')}`;

    // ปิดปุ่ม Clear เมื่อไม่มีออเดอร์หรือกำลังทำรายการ
    document.getElementById('clear-table').disabled = !tableOrders.length || state.clearing || state.sending;

    // วนลูปแสดงออเดอร์ของโต๊ะ
    for (const order of tableOrders) {
        const status = normalized(order);

        const card = node('article', 'customer-order');
        const head = node('div', 'customer-order-top');

        // แสดงหมายเลขออเดอร์ ชื่ออาหาร และสถานะ
        head.append(
            node(
                'strong',
                '',
                `#${String(order.id).padStart(3, '0')} · ${order.menu_name}`
            ),
            badge(status)
        );

        card.append(
            head,

            // แสดงจำนวน ราคา และข้อความตามสถานะอาหาร
            node(
                'p',
                '',
                `${order.quantity} จาน · ${money(order.total)} · ${
          status === 'done'
            ? 'อาหารพร้อมแล้ว รอรับความอร่อยได้เลย'
            : status === 'cooking'
              ? 'ครัวกำลังปรุงอาหารให้คุณ'
              : 'ครัวได้รับออเดอร์ของคุณแล้ว'
        }`
            )
        );

        // สร้างแถบแสดงความคืบหน้าของอาหาร
        const progress = node('div', 'progress');

        for (let i = 0; i < 3; i++) {
            progress.append(
                node(
                    'span',
                    i <= ['preparing', 'cooking', 'done'].indexOf(status) ?
                    'filled' :
                    ''
                )
            );
        }

        card.append(progress);

        // เพิ่มการ์ดออเดอร์ลงในหน้าเว็บ
        mine.append(card);
    }

    // หากไม่มีออเดอร์ของโต๊ะนี้ ให้แสดงข้อความ
    if (!tableOrders.length) {
        empty(
            mine,
            'ยังไม่มีออเดอร์สำหรับโต๊ะนี้ เลือกจานโปรดกันเลย'
        );
    }
}


// Function: showClearDialog()
// หน้าที่: เปิดหน้าต่างยืนยันก่อน Clear โต๊ะ
function showClearDialog() {
    // บันทึกหมายเลขโต๊ะที่ต้องการ Clear
    clearTarget = state.table;

    // ค้นหาออเดอร์ของโต๊ะนั้น
    const orders = state.orders.filter(
        (order) => order.table_no === clearTarget
    );

    // ตรวจสอบว่ามีออเดอร์และไม่ได้กำลังทำรายการอื่น
    if (!orders.length || state.clearing || state.sending) return;

    // นับจำนวนออเดอร์ที่ยังไม่เสร็จ
    const unfinished = orders.filter(
        (order) => normalized(order) !== 'done'
    ).length;

    // กำหนดหัวข้อหน้าต่างยืนยัน
    document.getElementById('clear-title').textContent =
        `Clear โต๊ะ ${String(clearTarget).padStart(2, '0')}?`;

    // แสดงรายละเอียดการ Clear
    document.getElementById('clear-description').textContent =
        `ล้าง ${orders.length} รายการออกจากหน้าลูกค้าของโต๊ะนี้ โดยรายการที่เสร็จแล้วยังอยู่ใน Done` +
        (
            unfinished ?
            ` (มี ${unfinished} รายการที่ยังไม่เสร็จ ซึ่งจะถูกลบโดยไม่เก็บประวัติ)` :
            ''
        );

    // เปิดหน้าต่างยืนยัน
    document.getElementById('clear-dialog').showModal();
}


// ==========================================
// API FUNCTIONS
// ==========================================


// Function: getMenu()
// หน้าที่: ดึงข้อมูลเมนูอาหารทั้งหมดจาก Server
async function getMenu() {

    // ส่ง GET Request ไปยัง Server
    const response = await fetch('/api/menu');

    // แปลงข้อมูลที่ได้รับเป็น JSON
    const content = await response.json();

    // ตรวจสอบว่าการ Request สำเร็จหรือไม่
    if (!response.ok) {
        throw new Error(content.message || 'โหลดเมนูไม่สำเร็จ');
    }

    // ส่งข้อมูลเมนูกลับไปยัง Function ที่เรียกใช้
    return content;
}


// Function: getOrders()
// หน้าที่: ดึงข้อมูลออเดอร์ทั้งหมดของทุกโต๊ะจาก Server
async function getOrders() {

    // ส่ง GET Request ไปยัง Server
    const response = await fetch('/api/orders');

    // แปลงข้อมูลที่ได้รับเป็น JSON
    const content = await response.json();

    // ตรวจสอบว่าการ Request สำเร็จหรือไม่
    if (!response.ok) {
        throw new Error(content.message || 'โหลดออเดอร์ไม่สำเร็จ');
    }

    // ส่งข้อมูลออเดอร์กลับไปยัง Function ที่เรียกใช้
    return content;
}


// Function: sendOrder(event)
// หน้าที่: ส่งคำสั่งซื้ออาหารจากลูกค้าไปยัง Server
async function sendOrder(event) {

    // ป้องกันการ Submit Form แบบปกติ
    event.preventDefault();

    // ตรวจสอบว่ามีเมนูที่เลือกและไม่ได้กำลังทำรายการอื่น
    if (!selectedMenu() || state.sending || state.clearing) return;

    // กำหนดสถานะว่ากำลังส่งออเดอร์
    state.sending = true;

    renderSummary();
    renderCustomerOrders();

    try {

        // ส่งข้อมูลคำสั่งซื้อไปยัง Server
        const response = await fetch('/api/orders', {
            method: 'POST',

            // ระบุว่าข้อมูลที่ส่งเป็น JSON
            headers: {
                'Content-Type': 'application/json',
            },

            // แปลงข้อมูลโต๊ะ เมนู และจำนวนอาหารเป็น JSON
            body: JSON.stringify({
                table_no: state.table,
                menu_item_id: state.selected,
                quantity: state.quantity,
            }),
        });

        // รับข้อมูลตอบกลับจาก Server
        const content = await response.json();

        // ตรวจสอบว่าการส่งออเดอร์สำเร็จหรือไม่
        if (!response.ok) {
            throw new Error(content.message || 'ส่งออเดอร์ไม่สำเร็จ');
        }

        // แจ้งหมายเลขออเดอร์ที่สั่งสำเร็จ
        notify(
            `รับออเดอร์ #${String(content.id).padStart(3, '0')} แล้ว ติดตามสถานะได้ที่ออเดอร์ของโต๊ะคุณ`
        );

        // โหลดข้อมูลล่าสุดจาก Server
        await refresh();

    } catch (err) {

        // แสดงข้อความเมื่อเกิดข้อผิดพลาด
        notify(err.message, true);

    } finally {

        // ยกเลิกสถานะกำลังส่งออเดอร์
        state.sending = false;

        // อัปเดตหน้าจอ
        renderSummary();
        renderCustomerOrders();
    }
}


// Function: clearTable()
// หน้าที่: ส่งหมายเลขโต๊ะไปยัง Server เพื่อ Clear ออเดอร์
async function clearTable() {

    // ตรวจสอบว่ากำลัง Clear หรือไม่มีโต๊ะเป้าหมายหรือไม่
    if (state.clearing || clearTarget === null) return;

    // เก็บหมายเลขโต๊ะที่จะ Clear
    const table = clearTarget;

    // กำหนดสถานะว่ากำลัง Clear
    state.clearing = true;

    // ปิดหน้าต่างยืนยัน
    document.getElementById('clear-dialog').close();

    renderSummary();
    renderCustomerOrders();

    try {

        // ส่ง Request ไปยัง Server
        const response = await fetch('/api/tables/clear', {
            method: 'POST',

            // กำหนดรูปแบบข้อมูลเป็น JSON
            headers: {
                'Content-Type': 'application/json',
            },

            // ส่งหมายเลขโต๊ะไปยัง Server
            body: JSON.stringify({
                table_no: table,
            }),
        });

        // รับผลลัพธ์จาก Server
        const content = await response.json();

        // ตรวจสอบว่าการ Clear สำเร็จหรือไม่
        if (!response.ok) {
            throw new Error(content.message || 'Clear โต๊ะไม่สำเร็จ');
        }

        // แจ้งผลการ Clear โต๊ะ
        notify(
            `Clear โต๊ะ ${String(table).padStart(2, '0')} แล้ว ${content.cleared_count} รายการ`
        );

        // โหลดข้อมูลล่าสุด
        await refresh();

    } catch (err) {

        // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
        notify(err.message, true);

    } finally {

        // ยกเลิกสถานะกำลัง Clear
        state.clearing = false;

        // ล้างค่าโต๊ะเป้าหมาย
        clearTarget = null;

        renderSummary();
        renderCustomerOrders();
    }
}


// ==========================================
// SOCKET.IO
// ==========================================


// Function: connectSocket()
// หน้าที่: เชื่อมต่อกับ Server ผ่าน Socket.IO
// เพื่อรับการแจ้งเตือนเมื่อข้อมูลมีการเปลี่ยนแปลง
function connectSocket() {

    // สร้างการเชื่อมต่อ Socket.IO
    socket = io();

    // ทำงานเมื่อเชื่อมต่อกับ Server สำเร็จ
    socket.on('connect', () => {

        // ส่ง Event ไปขอรับการอัปเดตจาก Server
        socket.emit('request_update');
    });

    // รับ Socket ID จาก Server
    socket.on('your_id', (data) => {
        console.log('Socket ID:', data.id);
    });

    // รับ Event เมื่อข้อมูลมีการเปลี่ยนแปลง
    socket.on('data:changed', (data) => {

        // แสดงข้อมูล Event ใน Console
        console.log('Data changed:', data.entity);

        // โหลดข้อมูลล่าสุดจาก Server
        refresh();
    });

    // ทำงานเมื่อ Socket หลุดการเชื่อมต่อ
    socket.on('disconnect', () => {
        document.getElementById('connection').textContent =
            'กำลังเชื่อมต่อใหม่';
    });
}


// ==========================================
// REFRESH DATA
// ==========================================


// Function: refresh()
// หน้าที่: โหลดเมนูและออเดอร์ล่าสุดจาก Server
// และอัปเดตข้อมูลที่แสดงบนหน้า Customer
async function refresh() {

    // เพิ่มหมายเลขรอบการโหลดข้อมูล
    refreshVersion++;

    // เก็บหมายเลขรอบปัจจุบัน
    const version = refreshVersion;

    try {

        // โหลดเมนูและออเดอร์พร้อมกัน
        const [menu, orders] = await Promise.all([
            getMenu(),
            getOrders(),
        ]);

        // หากมีการเรียก refresh รอบใหม่ระหว่างรอ
        // จะไม่ใช้ข้อมูลจากรอบเก่า
        if (version !== refreshVersion) return;

        // บันทึกข้อมูลเมนูลงใน state
        state.menu = menu;

        // บันทึกข้อมูลออเดอร์ลงใน state
        state.orders = orders;

        // หากเมนูที่เลือกไม่มีอยู่แล้ว ให้ยกเลิกการเลือก
        if (!selectedMenu()) {
            state.selected = null;
        }

        // แสดงเมนูอาหารใหม่
        renderMenu();

        // แสดงออเดอร์ของโต๊ะที่เลือก
        renderCustomerOrders();

    } catch (err) {

        // แจ้งเตือนเมื่อโหลดข้อมูลไม่สำเร็จ
        notify(err.message, true);
    }
}


// ==========================================
// INITIALIZATION
// ==========================================


// Function: pageLoad()
// หน้าที่: ตั้งค่าเริ่มต้นเมื่อหน้า Customer โหลดเสร็จ
function pageLoad() {

    // สร้างตัวเลือกหมายเลขโต๊ะตั้งแต่ 1 ถึง 5
    for (let i = 1; i <= 5; i++) {

        const option = node(
            'option',
            '',
            `โต๊ะ ${String(i).padStart(2, '0')}`
        );

        option.value = i;

        // เพิ่มตัวเลือกโต๊ะลงใน Select
        document.getElementById('table-select').append(option);
    }


    // เมื่อเปลี่ยนหมายเลขโต๊ะ
    document.getElementById('table-select').onchange = (event) => {

        // บันทึกหมายเลขโต๊ะที่เลือก
        state.table = Number(event.target.value);

        // อัปเดตสรุปและรายการออเดอร์
        renderSummary();
        renderCustomerOrders();
    };


    // เมื่อกดปุ่มลดจำนวนอาหาร
    document.getElementById('minus').onclick = () => {

        // ลดจำนวนอาหาร แต่ต้องไม่น้อยกว่า 1
        state.quantity = Math.max(1, state.quantity - 1);

        renderSummary();
    };


    // เมื่อกดปุ่มเพิ่มจำนวนอาหาร
    document.getElementById('plus').onclick = () => {

        // เพิ่มจำนวนอาหาร แต่ต้องไม่เกิน 20
        state.quantity = Math.min(20, state.quantity + 1);

        renderSummary();
    };


    // เมื่อ Submit Form ให้เรียก sendOrder()
    document.getElementById('order-form').onsubmit = sendOrder;


    // เมื่อกดปุ่ม Clear โต๊ะ ให้เปิดหน้าต่างยืนยัน
    document.getElementById('clear-table').onclick = showClearDialog;


    // เมื่อกดยืนยัน Clear ให้เรียก clearTable()
    document.getElementById('confirm-clear').onclick = clearTable;


    // เมื่อกดยกเลิก ให้ปิดหน้าต่างยืนยัน
    document.getElementById('cancel-clear').onclick = () => {
        document.getElementById('clear-dialog').close();
    };


    // แสดงสรุปเริ่มต้น
    renderSummary();

    // โหลดเมนูและออเดอร์จาก Server
    refresh();

    // เชื่อมต่อ Socket.IO
    connectSocket();
}


// เรียก pageLoad() เมื่อหน้าเว็บโหลดเสร็จ
window.onload = pageLoad;