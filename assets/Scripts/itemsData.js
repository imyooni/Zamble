export function heavyWeapons(id) {
  const list = {
    diamondBlade: [0, "Diamond Blade",true],
    muramasa: [1, "Muramasa",false],
  };
  const foundItem = Object.values(list).find(item => item[0] === id-1) || null;
  return foundItem ? ["heavyWeapons", ...foundItem] : null;
}

export function magicStaffs(id) {
  const list = {
    diamondBlade: [0, "Diamond Blade",true],
    muramasa: [1, "Muramasa",true],
  };
  const foundItem = Object.values(list).find(item => item[0] === id-1) || null;
  return foundItem ? [...foundItem, "magicStaffs"] : null;
}
