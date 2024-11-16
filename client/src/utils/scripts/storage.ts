const storage = {
  get: (key: string) => {
    return localStorage.getItem(key);
  },
  set: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  delete: (key: string) => {
    localStorage.removeItem(key);
  }
};

export default storage;
