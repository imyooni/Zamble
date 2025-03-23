export function movement(id) {
  const list = {
    fixed:  {
      desc: "This item can't be moved."
    },
    auto:  {
        desc: "This item will move to a random position at the end of the turn."
      },
    manual:  {
        desc: "You can move this item to any position."
     },
  };
  const foundItem = list[id] || null;
  return foundItem;
}

export function rarity(id) {
    const list = {
      normal:  {
        desc: "The rarity of this item is normal."
      },
      unusual:  {
          desc: "The rarity of this item is unusual."
        },
      rare:  {
          desc: "The rarity of this item is rare."
       },
      special:  {
        desc: "The rarity of this item is special."
     }, 
    };
    let keys = Object.keys(list)
    const foundItem = list[keys[id]] || null;
    return foundItem;
  }

export function params(id) {
    const list = {
      hp:  {
        desc: "Max health points."
      },
      mp:  {
          desc: "This item will move to a random position at the end of the turn."
        },
      def:  {
          desc: "Defense points."
       },
      atk:  {
        desc: "Atack points."
      }, 
    };
    const foundItem = list[id.toLowerCase()] || null;
    return foundItem;
  }