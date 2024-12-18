Object.defineProperty(window, 'localStorage', {
    value: {
      store: {},
      getItem(key) {
        return this.store[key] || null;
      },
      setItem(key, value) {
        this.store[key] = value.toString();
      },
      removeItem(key) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      }
    },
    configurable: true
  });
  
  // Mock process.env
  process.env.NEXT_PUBLIC_BACKEND = 'http://backend';
  process.env.NEXT_PUBLIC_CCV_API = 'http://ccv-api';
  process.env.NEXT_PUBLIC_COMMUNITY_ID = 'community123';