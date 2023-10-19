export function Now() {
    function pad2(n: number) {  // always returns a string
        return (n < 10 ? '0' : '') + n;
    }
    const now = new Date()
    return now.getFullYear() +
           pad2(now.getMonth() + 1) + 
           pad2(now.getDate()) +
           pad2(now.getHours()) +
           pad2(now.getMinutes()) +
           pad2(now.getSeconds());
}
export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c:any) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

