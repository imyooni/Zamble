function heavyWeapons(id) {
  const list = {
    diamondBlade: [0, "Diamond Blade"],
    muramasa: [1, "Muramasa"],
  };
  const foundItem = Object.values(list).find(item => item[0] === id) || null;
  return foundItem ? [...foundItem, "heavyWeapons"] : null;
}

function magicStaffs(id) {
  const list = {
    diamondBlade: [0, "Diamond Blade"],
    muramasa: [1, "Muramasa"],
  };
  const foundItem = Object.values(list).find(item => item[0] === id) || null;
  return foundItem ? [...foundItem, "magicStaffs"] : null;
}
