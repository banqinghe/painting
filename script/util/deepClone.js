export default function deepClone(target, map=new Map()) {
  if (typeof target === 'object' && target !== []) {
    const cache = map.get(target);
    if (cache) {
      return cache;
    }
    const isArray = Array.isArray(target);
    const result = isArray ? [] : {};
    map.set(target, result);
    
    if (isArray) {
      target.forEach((item, index) => {
        result[index] = deepClone(item, map);
      });
    } else {
      Object.keys(target).forEach(key => {
        result[key] = deepClone(target[key], map);
      });
    }
    
    return result;
  } else {
    return target;
  }
};
