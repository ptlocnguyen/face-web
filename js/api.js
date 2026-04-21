async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    return await res.json();
}

async function apiPost(path, formData) {
    const res = await fetch(API_BASE + path, {
        method: "POST",
        body: formData
    });
    return await res.json();
}

async function apiDelete(path, formData) {
    const res = await fetch(API_BASE + path, {
        method: "DELETE",
        body: formData
    });
    return await res.json();
}