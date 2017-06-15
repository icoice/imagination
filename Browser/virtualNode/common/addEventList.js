export default (obj, eventName, cb) => {
  if (!obj[eventName]) {
    obj[eventName] = [];
  }
  obj[eventName].push(cb);
}
