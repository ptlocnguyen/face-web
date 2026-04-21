const video = document.getElementById("video");

// mở camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    });

// =============================
// UPLOAD IMAGE
// =============================
async function uploadImage() {
    const file = document.getElementById("fileInput").files[0];
    if (!file) return alert("Chọn ảnh trước");

    setLoading(true);

    try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("device_id", "web");

        const res = await fetch(API_BASE + "/recognize", {
            method: "POST",
            body: fd
        });

        const data = await res.json();
        showResult(data);

    } catch (e) {
        document.getElementById("result").innerHTML = "❌ Lỗi kết nối";
    }

    setLoading(false);
}

// =============================
// CAPTURE CAMERA
// =============================
async function capture() {
    setLoading(true);

    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, 320, 240);

    canvas.toBlob(async (blob) => {
        try {
            const fd = new FormData();
            fd.append("file", blob, "capture.jpg");
            fd.append("device_id", "web");

            const res = await fetch(API_BASE + "/recognize", {
                method: "POST",
                body: fd
            });

            const data = await res.json();
            showResult(data);

        } catch (e) {
            document.getElementById("result").innerHTML = "❌ Lỗi kết nối";
        }

        setLoading(false);

    }, "image/jpeg");
}

// =============================
// HIỂN THỊ KẾT QUẢ
// =============================
function showResult(data) {
    const el = document.getElementById("result");

    if (data.status === "success") {
        el.innerHTML = `
            <span style="color:green; font-weight:bold">
            ✔ ${data.user_id}
            </span><br>
            Score: ${data.score.toFixed(3)}
        `;
    } else if (data.status === "unknown") {
        el.innerHTML = `<span style="color:red">❌ Unknown</span>`;
    } else if (data.status === "no_face") {
        el.innerHTML = `⚠ Không phát hiện khuôn mặt`;
    } else {
        el.innerHTML = `❌ ${data.message}`;
    }
}

// =============================
// LOADING STATE
// =============================
function setLoading(isLoading) {
    const uploadBtn = document.getElementById("uploadBtn");
    const captureBtn = document.getElementById("captureBtn");
    const result = document.getElementById("result");

    if (isLoading) {
        uploadBtn.disabled = true;
        captureBtn.disabled = true;

        uploadBtn.innerText = "Đang xử lý...";
        captureBtn.innerText = "Đang xử lý...";

        result.innerHTML = "⏳ Đang nhận diện, vui lòng chờ...";
    } else {
        uploadBtn.disabled = false;
        captureBtn.disabled = false;

        uploadBtn.innerText = "Nhận diện";
        captureBtn.innerText = "Chụp & nhận diện";
    }
}