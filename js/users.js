function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 2000);
}

async function loadUsers() {
    const users = await apiGet("/users");
    const fps = await apiGet("/fingerprint/all");
    const faces = await apiGet("/face/all");

    const table = document.getElementById("userTable");
    table.innerHTML = "";

    const keyword = document.getElementById("search").value.toLowerCase();

    users.users.forEach(u => {

        if (!u.user_id.toLowerCase().includes(keyword)) return;

        const hasFP = fps.data.find(f => f.user_id === u.user_id);
        const hasFace = faces.data.includes(u.user_id);

        const row = `
        <tr>
            <td>${u.user_id}</td>
            <td>${u.name}</td>
            <td>
                <span class="badge ${hasFace ? "green" : "red"}">
                    ${hasFace ? "OK" : "NO"}
                </span>
            </td>
            <td>
                <span class="badge ${hasFP ? "green" : "red"}">
                    ${hasFP ? "OK" : "NO"}
                </span>
            </td>
            <td>
                <button class="btn danger" onclick="deleteUser('${u.user_id}')">Xóa</button>
                <button class="btn warning" onclick="deleteFP('${u.user_id}')">Vân tay</button>
                <button class="btn warning" onclick="deleteFace('${u.user_id}')">Khuôn mặt</button>
            </td>
        </tr>
        `;

        table.innerHTML += row;
    });
}

async function createUser() {
    const fd = new FormData();
    fd.append("user_id", document.getElementById("user_id").value);
    fd.append("name", document.getElementById("name").value);

    await apiPost("/user/create", fd);
    showToast("Đã thêm user");
    loadUsers();
}

async function deleteUser(id) {
    if (!confirm("Xóa user này?")) return;

    const fd = new FormData();
    fd.append("user_id", id);

    await apiDelete("/user/delete", fd);
    showToast("Đã xóa user");
    loadUsers();
}

async function deleteFP(id) {
    if (!confirm("Xóa vân tay?")) return;

    const fd = new FormData();
    fd.append("user_id", id);

    await apiDelete("/fingerprint/delete", fd);
    showToast("Đã xóa vân tay");
    loadUsers();
}

async function deleteFace(id) {
    if (!confirm("Xóa khuôn mặt?")) return;

    const fd = new FormData();
    fd.append("user_id", id);

    await apiDelete("/user/delete-embedding", fd);
    showToast("Đã xóa khuôn mặt");
    loadUsers();
}

loadUsers();