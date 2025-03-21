export function vocab(language) {
    return {
        eng: {
            newGameVocab: "New Game",
            optionsVocab: "Options",
            exitVocab: "Exit",
            goal: "Goal",
            day: "Day",
            endDay: "End Day",
            yes: "Yes",
            no: "No",
            shop: "Shop",
            free: "Free",
            finish: "Finish?"
        },
        kor: {
            newGameVocab: "새 게임",
            optionsVocab: "옵션",
            exitVocab: "종료",
            goal: "목표",
            day: "일", 
            endDay: "일 종료", 
            yes: "예",
            no: "아니요",
            shop: "상점",
            free: "공짜",
            finish: "다 했어요?",
        }
    }[language]; 
}


export function months(id,language = "eng") {
  let m;
  const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sept","Oct","Nov","Dec"
  ]
  if (language === "eng") {
   m = `${months[id[0]-1]} ${id[1]}`
  } else {
   m = `${id[0]}월 ${id[1]}일`
  }
 return m
}

export function pieceDesc(language) {
    return {
      eng: {
        numbers: "Combine different pieces to reach a total of 10 points.",
        numbers2: "This piece contains a hidden number.",
        blocked: "A blocked piece that does nothing.",
        star: "This piece can pair with any number to make 10 points.",
        bubble: "This piece is destroyed when a nearby piece is destroyed.",
        shop: "Refreshes the available pieces in the shop.",
        zul: `Combine "Zul" pieces to get a special reward.`,
        reroll: "Gain an extra reroll to refresh empty spaces.",
        colors: "Match two pieces of the same color to score 10 points.",
        roman: "These pieces change every turn.",
        bomb1: "Destroys all pieces in a 3x3 area.",
        bomb2: "Destroys all pieces in a cross shape.",
        bomb3: "This bomb will explode automatically.",
        fire: "Randomly destroy nearby pieces.",
        rainbow: "Transforms certain numbers into colors.",
        updown: "Change number values.",
        multi: "Multiply the points of the current combination in x2.",
        ice: "Frost nearby pieces and make them unusable.",
      },
      kor: {
        numbers: "조각을 합쳐서 10점을 만들어 보세요.",
        numbers2: "이 조각에는 숨겨진 숫자가 있습니다.",
        blocked: "아무런 기능이 없는 막힌 조각입니다.",
        star: "이 조각은 어떤 숫자와도 짝을 이루어 10점을 만들 수 있어요.",
        bubble: "근처 조각이 파괴되면 함께 사라집니다.",
        shop: "상점을 새로고침합니다.",
        zul: `"Zul" 조각을 합치면 특별한 보상을 받을 수 있어요.`,
        reroll: "빈 공간을 새로고침할 수 있는 추가 리롤을 획득하세요.",
        colors: "같은 색상의 두 조각을 맞추면 10점을 얻을 수 있어요.",
        roman: "이 조각은 매 턴마다 변합니다.",
        bomb1: "3x3 범위의 모든 조각을 파괴합니다.",
        bomb2: "십자 모양으로 모든 조각을 파괴합니다.",
        bomb3: "이 폭탄은 자동으로 폭발합니다.",
        fire: "주변 조각을 랜덤으로 파괴합니다.",
        rainbow: "특정 숫자를 색상으로 변환합니다.",
        updown: "숫자 값을 변경합니다.",
        multi: "해당 조합의 점수를 2배로 증가시킵니다.",
        ice: "주변 조각을 얼려서 사용할 수 없게 만듭니다.",
      }
    }[language];
  }