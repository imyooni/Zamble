export function heavyWeapons(id) {
  const list = {
    diamondBlade:  {
      index: 1,
      name: "Diamond Blade",
      movement: "Manual",
      rarity: 0,
    },
    muramasa:  {
      index: 2,
      name: "Muramasa",
      movement: "Manual",
      rarity: 0,
    },
    infernalAxe:  {
      index: 10,
      name: "Infernal Axe",
      movement: "Fixed",
      rarity: 0,
    },
  };
  const foundItem = Object.values(list).find(item => item.index === id) || null;
  return foundItem;
}

export function magicStaffs(id) {
  const list = {
    woodenStaff:  {
      index: 1,
      name: "Wooden Staff",
      movement: "Manual",
      rarity: 0,
    },
    muramasa:  {
      index: 2,
      name: "Muramasa",
      movement: "Manual",
      rarity: 0,
    },
  };
  const foundItem = Object.values(list).find(item => item.index === id) || null;
  return foundItem;
}

