const API = "https://face-api-z57y.onrender.com";

// PREVIEW
document.getElementById("file_reg").onchange = e => {
    document.getElementById("preview_reg").src = URL.createObjectURL(e.target.files[0]);
};

document.getElementById("file_rec").onchange = e => {
    document.getElementById("preview_rec").src = URL.createObjectURL(e.target.files[0]);
};

// REGISTER
async function register() {

    let file = document.getElementById("file_reg").files[0];
    let name = document.getElementById("name").value;

    if (!file || !name) return alert("Nhập đủ");

    let fd = new FormData();
    fd.append("file", file);
    fd.append("name", name);

    document.getElementById("reg_result").innerText = "Đang gửi...";

    try {
        let res = await fetch(API + "/register", {
            method: "POST",
            body: fd
        });

        let text = await res.text();

        document.getElementById("reg_result").innerText = text;

    } catch {
        document.getElementById("reg_result").innerText = "Lỗi server";
    }
}

// RECOGNIZE
async function recognize() {

    let file = document.getElementById("file_rec").files[0];
    if (!file) return alert("Chọn ảnh");

    let fd = new FormData();
    fd.append("file", file);

    document.getElementById("rec_result").innerText = "Đang nhận diện...";

    try {
        let res = await fetch(API + "/recognize_image", {
            method: "POST",
            body: fd
        });

        let text = await res.text();

        document.getElementById("rec_result").innerText = "Kết quả: " + text;

    } catch {
        document.getElementById("rec_result").innerText = "Lỗi mạng";
    }
}

// LOAD LOGS
async function loadLogs() {

    let res = await fetch(API + "/logs");
    let data = await res.json();

    let html = "";

    data.forEach(l => {
        html += `<tr>
                    <td>${l.name}</td>
                    <td>${l.time}</td>
                 </tr>`;
    });

    document.getElementById("log_table").innerHTML = html;
}

// AUTO REFRESH
setInterval(loadLogs, 5000);
loadLogs();
