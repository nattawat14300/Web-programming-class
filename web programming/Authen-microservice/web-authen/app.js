const login = async (event) => {
    event.preventDefault();

    console.log("login");
    const form =  document.getElementsByName('form')[0];
    const output = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: form.username.value,
            password: form.password.value
        }),
        credentials: 'include' // บังคับให้เบราว์เซอร์ยอมรับ Cookie ข้ามพอร์ต
    });
    const result = await output.json();
    console.log(result);

    if (result.access) {
        document.getElementById('logout').removeAttribute('hidden');
        document.getElementById('resultMessage').textContent = result.message;
        document.getElementById('auth').setAttribute('hidden', true);
    }
}

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const checkAuth = async () => {
    const output = await fetch('/dashboard', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // บังคับให้เบราว์เซอร์ยอมรับ Cookie ข้ามพอร์ต
    });
    const result = await output.json();
    console.log(result);
    if (result.access) {
        document.getElementById('logout').removeAttribute('hidden');
        document.getElementById('resultMessage').textContent = result.message;
        document.getElementById('auth').setAttribute('hidden', true);
    }
}   

const logout = async (event) => {
    event.preventDefault();
    const output = await fetch('/logout', {
        method: 'POST',
        headers: { contentType: 'application/json' },
        credentials: 'include' // บังคับให้เบราว์เซอร์ยอมรับ Cookie ข้ามพอร์ต
    });
    const result = await output.json();
    console.log(result);
    if (!result.access) {
        document.getElementById('logout').setAttribute('hidden', true);
        document.getElementById('resultMessage').textContent = result.message;
        document.getElementById('auth').removeAttribute('hidden');
    }
}


window.onload = () => {
    const loginbtn = document.getElementById('form');
    loginbtn.onsubmit = login; 
    
    const logoutbtn = document.getElementById('logout');
    logoutbtn.onclick = logout;
    const username = getCookie('username');
    console.log(`username from cookie: ${username}`);
    checkAuth();
}

