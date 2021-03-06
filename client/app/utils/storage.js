export function getFromStorage(key) {
  if (!key) {
    return null;
  }
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  catch (err) {
    return null;
  }
}

export function setInStorage(key, obj) {
  if (!key) {
    console.error('Error: Key is missing')
  }
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  }
  catch (err) {
    console.error(err)
  }
}
