const BASE = "https://face-api-z57y.onrender.com";

// TAB
function showTab(id) {
    document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
    document.getElementById(id).style.display = "block";
}

// ================= USER =================
async function createUser() {
    let code = document.getElementById("new_code").value;
    let name = document.getElementById("new_name").value;

    let form = new FormData();
    form.append("user_code", code);
    form.append("full_name", name);

    await fetch(BASE + "/users", {
        method: "POST",
        body: form
    });

    loadUsers();
}

async function loadUsers() {
    let res = await fetch(BASE + "/users");
    let data = await res.json();

    let list = document.getElementById("user_list");
    let select = document.getElementById("face_user");

    list.innerHTML = "";
    select.innerHTML = "";

    data.forEach(u => {
        list.innerHTML += `<li>${u.user_code} - ${u.full_name}</li>`;
        select.innerHTML += `<option value="${u.user_code}">${u.full_name}</option>`;
    });
}

// ================= FACE =================
async function registerFace() {
    let user = document.getElementById("face_user").value;
    let files = document.getElementById("face_files").files;

    let form = new FormData();
    form.append("user_code", user);

    for (let f of files) {
        form.append("files", f);
    }

    let res = await fetch(BASE + "/register-face", {
        method: "POST",
        body: form
    });

    let data = await res.json();

    document.getElementById("face_result").innerText =
        JSON.stringify(data, null, 2);
}

// ================= LOG =================
async function loadLogs() {
    let res = await fetch(BASE + "/logs");
    let data = await res.json();

    let table = document.getElementById("log_table");
    table.innerHTML = "";

    data.forEach(l => {
        table.innerHTML += `
        <tr>
            <td>${l.full_name_snapshot}</td>
            <td>${l.identify_method}</td>
            <td>${l.result}</td>
            <td>${l.time}</td>
        </tr>`;
    });
}

// init
loadUsers();
