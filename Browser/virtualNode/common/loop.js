export default (data, callback) => {
  for (let i = 0; i < data.length; i++) {
    callback(typeof data === 'string' ? data.charAt(i) : data[i], i);
  }
}
