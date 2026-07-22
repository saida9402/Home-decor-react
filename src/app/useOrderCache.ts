export const useOrderCache = () => {
  const getCache = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  const setCache = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  return { getCache, setCache };
};
