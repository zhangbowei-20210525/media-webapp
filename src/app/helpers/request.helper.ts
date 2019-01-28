export function toFormData(obj: object) {
    const f = new FormData();
    Object.keys(obj).forEach(key => {
        if (obj[key]) {
            f.append(key, obj[key]);
        }
    });
    return f;
}
