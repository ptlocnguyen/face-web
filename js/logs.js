function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 2000);
}

async function loadLogs() {
    const res = await apiGet("/logs?limit=50");

    const table = document.getElementById("logTable");
    table.innerHTML = "";

    const filter = document.getElementById("filter").value;

    res.logs.forEach(l => {

        if (filter && l.status !== filter) return;

        const statusClass = l.status === "success" ? "green" : "red";

        const row = `
        <tr>
            <td>${l.user_id}</td>
            <td>${l.method}</td>
            <td>
                <span class="badge ${statusClass}">
                    ${l.status.toUpperCase()}
                </span>
            </td>
            <td>${l.device_id}</td>
            <td>${formatTime(l.time)}</td>
        </tr>
        `;

        table.innerHTML += row;
    });
}

function formatTime(t) {
    const d = new Date(t);
    return d.toLocaleString("vi-VN");
}

// auto refresh mỗi 5s
setInterval(loadLogs, 5000);

loadLogs();