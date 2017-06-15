export default (obj, callback) => {
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      callback(obj[k], k);
    }
  }
}
