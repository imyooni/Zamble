export function lightArmors(id) {
  const list = {
    copperRing:  {
      index: 5,
      name: "Copper Ring",
      movement: "Fixed",
      effects: null,
      rarity: 0,
    },
  };
  const foundItem = Object.values(list).find(item => item.index === id) || null;
  return foundItem;
}

export function heavyWeapons(id) {
  const list = {
    diamondBlade:  {
      index: 1,
      name: "Diamond Blade",
      movement: "Manual",
      effects: null,
      rarity: 0,
    },
    muramasa:  {
      index: 2,
      name: "Muramasa",
      movement: "Manual",
      effects: null,
      rarity: 0,
    },
    infernalAxe:  {
      index: 10,
      name: "Infernal Axe",
      movement: "Fixed",
      effects: null,
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
      effects: null,
      rarity: 0,
    },
    muramasa:  {
      index: 2,
      name: "Muramasa",
      movement: "Manual",
      effects: null,
      rarity: 0,
    },
  };
  const foundItem = Object.values(list).find(item => item.index === id) || null;
  return foundItem;
}

export function powerUps(id) {
  const list = {
    hpUp:  {
      index: 1,
      name: "Hp Up",
      movement: "Auto",
      effects: {
       paramUp: ["hp",[10,25]] 
      },
      rarity: 0,
    },
    mpUp:  {
      index: 2,
      name: "MP Up",
      movement: "Auto",
      effects: {
        paramUp: ["mp",[5,10]] 
       },
      rarity: 0,
    },
    atkUp:  {
      index: 3,
      name: "Atk Up",
      movement: "Auto",
      effects: {
        paramUp: ["atk",[1,5]] 
       },
      rarity: 0,
    },
    defUp:  {
      index: 4,
      name: "Def Up",
      movement: "Auto",
      effects: {
        paramUp: ["def",[1,5]] 
       },
      rarity: 0,
    },
  };
  const foundItem = Object.values(list).find(item => item.index === id) || null;
  return foundItem;
}
