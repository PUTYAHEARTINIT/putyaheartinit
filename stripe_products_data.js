const STRIPE_PRODUCTS = {
  "Creature Hoodie — Blue": {
    "name": "Creature Hoodie — Blue",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/aFa9AS36V2L892ScHPfQI0I",
      "M": "https://buy.stripe.com/cNi9AS36VclI2Eu6jrfQI0J",
      "L": "https://buy.stripe.com/eVq6oGfTHadA5QGbDLfQI0K",
      "XL": "https://buy.stripe.com/cNieVc22R3Pccf4cHPfQI0L",
      "XXL": "https://buy.stripe.com/dRmdR8bDretQ0wm4bjfQI0M"
    }
  },
  "Creature Hoodie — Cream": {
    "name": "Creature Hoodie — Cream",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/28E8wOePDclIgvk37ffQI0N",
      "M": "https://buy.stripe.com/3cI9AScHvclIdj8azHfQI0O",
      "L": "https://buy.stripe.com/cNi14m8rfbhEbb09vDfQI0P",
      "XL": "https://buy.stripe.com/4gM4gydLz85s92S37ffQI0Q",
      "XXL": "https://buy.stripe.com/dRm4gy5f371oencdLTfQI0R"
    }
  },
  "DESIRE Hoodie — Black": {
    "name": "DESIRE Hoodie — Black",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/3cI00i4aZ85sencgY5fQI0S",
      "M": "https://buy.stripe.com/dRm3cu6j7gBY0wm7nvfQI0T",
      "L": "https://buy.stripe.com/5kQdR836V1H4enc0Z7fQI0U",
      "XL": "https://buy.stripe.com/7sY5kCcHvetQ3Iy23bfQI0V",
      "XXL": "https://buy.stripe.com/8x27sK4aZ5XkfrggY5fQI0W"
    }
  },
  "DESIRE Hoodie — Blue": {
    "name": "DESIRE Hoodie — Blue",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/dRm5kC0YN85senc6jrfQI0X",
      "M": "https://buy.stripe.com/dRmcN44aZ4Tg2Eu0Z7fQI0Y",
      "L": "https://buy.stripe.com/cNi5kC4aZ1H43Iy23bfQI0Z",
      "XL": "https://buy.stripe.com/4gM4gyfTH0D07YObDLfQI10",
      "XXL": "https://buy.stripe.com/cNi14mdLz85s2EubDLfQI11"
    }
  },
  "Hearts Hoodie — Black": {
    "name": "Hearts Hoodie — Black",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/8x24gy0YNdpMenc0Z7fQI12",
      "M": "https://buy.stripe.com/6oUfZg4aZfxU2Eu0Z7fQI13",
      "L": "https://buy.stripe.com/fZu7sK36VdpM0wmePXfQI14",
      "XL": "https://buy.stripe.com/28EbJ0dLz0D07YO9vDfQI15",
      "XXL": "https://buy.stripe.com/fZuaEWePDclI7YO6jrfQI16"
    }
  },
  "Hearts Hoodie — Purple": {
    "name": "Hearts Hoodie — Purple",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/9B614m6j71H42Eu6jrfQI17",
      "M": "https://buy.stripe.com/5kQ8wO22R1H40wm37ffQI18",
      "L": "https://buy.stripe.com/28E28q4aZ0D01Aq8rzfQI19",
      "XL": "https://buy.stripe.com/bJeaEW6j7dpM5QGfU1fQI1a",
      "XXL": "https://buy.stripe.com/00w00i8rfclIenc4bjfQI1b"
    }
  },
  "Hearts Hoodie — Rust": {
    "name": "Hearts Hoodie — Rust",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/4gM28qbDretQdj8gY5fQI1c",
      "M": "https://buy.stripe.com/aFabJ0fTH4Tg0wmgY5fQI1d",
      "L": "https://buy.stripe.com/4gM8wO5f3fxU5QGdLTfQI1e",
      "XL": "https://buy.stripe.com/4gM00i36V1H4enc37ffQI1f",
      "XXL": "https://buy.stripe.com/cNi9ASgXLclI4MC37ffQI1g"
    }
  },
  "Kids Mascot Hoodie — Gray": {
    "name": "Kids Mascot Hoodie — Gray",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/fZuaEW4aZclI3Iy37ffQI1h",
      "M": "https://buy.stripe.com/aFa28qazn0D0enc6jrfQI1i",
      "L": "https://buy.stripe.com/6oU6oG6j785sa6WfU1fQI1j",
      "XL": "https://buy.stripe.com/14AaEW7nbfxU2Eu4bjfQI1k",
      "XXL": "https://buy.stripe.com/aFa4gydLz71o3IydLTfQI1l"
    }
  },
  "Kids Mascot Hoodie — Washed Black": {
    "name": "Kids Mascot Hoodie — Washed Black",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/5kQ28q22R0D0frgdLTfQI1m",
      "M": "https://buy.stripe.com/5kQ4gy9vjadAfrg0Z7fQI1n",
      "L": "https://buy.stripe.com/00w5kCdLz2L8cf423bfQI1o",
      "XL": "https://buy.stripe.com/8x2aEWgXLadAfrgazHfQI1p",
      "XXL": "https://buy.stripe.com/eVq14m4aZdpM4MCazHfQI1q"
    }
  },
  "Varsity Hoodie — Black": {
    "name": "Varsity Hoodie — Black",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/00w00i0YN85s2Eu4bjfQI1r",
      "M": "https://buy.stripe.com/8x24gyePD85s5QG0Z7fQI1s",
      "L": "https://buy.stripe.com/00w28q4aZ3Pc3IydLTfQI1t",
      "XL": "https://buy.stripe.com/eVqbJ07nbfxU0wmfU1fQI1u",
      "XXL": "https://buy.stripe.com/cNi6oGfTH0D0gvkgY5fQI1v"
    }
  },
  "Varsity Hoodie — Cream": {
    "name": "Varsity Hoodie — Cream",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/3cI3cudLzetQfrg37ffQI1w",
      "M": "https://buy.stripe.com/cNi5kCazn99wenccHPfQI1x",
      "L": "https://buy.stripe.com/5kQcN47nb4Tg0wm0Z7fQI1y",
      "XL": "https://buy.stripe.com/aFa28qdLz2L8a6WfU1fQI1z",
      "XXL": "https://buy.stripe.com/00wfZgePD1H45QGfU1fQI1A"
    }
  },
  "Varsity Hoodie — Gray": {
    "name": "Varsity Hoodie — Gray",
    "category": "Hoodies",
    "price": 160,
    "sizes": {
      "S": "https://buy.stripe.com/fZu8wOazndpM4MC5fnfQI1B",
      "M": "https://buy.stripe.com/14A8wOgXLetQencfU1fQI1C",
      "L": "https://buy.stripe.com/8x28wO0YNadAcf46jrfQI1D",
      "XL": "https://buy.stripe.com/dRm9AS0YNclI6UK0Z7fQI1E",
      "XXL": "https://buy.stripe.com/14A6oG8rfetQcf48rzfQI1F"
    }
  },
  "Varsity Set — Burgundy": {
    "name": "Varsity Set — Burgundy",
    "category": "Sweat Sets",
    "price": 300,
    "sizes": {
      "S": "https://buy.stripe.com/bJeeVcgXLetQgvk0Z7fQI1G",
      "M": "https://buy.stripe.com/bJedR822R4Tg92S8rzfQI1H",
      "L": "https://buy.stripe.com/28E7sKaznbhE6UKfU1fQI1I",
      "XL": "https://buy.stripe.com/fZu14mcHvdpMfrggY5fQI1J",
      "XXL": "https://buy.stripe.com/14AfZg7nbclIbb037ffQI1K"
    }
  },
  "Varsity Set — Cream": {
    "name": "Varsity Set — Cream",
    "category": "Sweat Sets",
    "price": 300,
    "sizes": {
      "S": "https://buy.stripe.com/5kQ14mfTH5Xk0wm4bjfQI1L",
      "M": "https://buy.stripe.com/9B6aEW5f3adA3Iy7nvfQI1M",
      "L": "https://buy.stripe.com/bJedR8cHv85s4MC4bjfQI1N",
      "XL": "https://buy.stripe.com/6oUcN4bDrbhEbb0gY5fQI1O",
      "XXL": "https://buy.stripe.com/00w00i36V5Xk1AqbDLfQI1P"
    }
  },
  "Varsity Set — Gray": {
    "name": "Varsity Set — Gray",
    "category": "Sweat Sets",
    "price": 300,
    "sizes": {
      "S": "https://buy.stripe.com/7sY7sK22R1H45QG9vDfQI1Q",
      "M": "https://buy.stripe.com/28EaEW8rf4Tgfrg4bjfQI1R",
      "L": "https://buy.stripe.com/7sYfZggXL2L8enc37ffQI1S",
      "XL": "https://buy.stripe.com/8x2fZg0YN4Tg0wm8rzfQI1T",
      "XXL": "https://buy.stripe.com/14AcN49vjgBY6UKgY5fQI1U"
    }
  },
  "Varsity Set — Green": {
    "name": "Varsity Set — Green",
    "category": "Sweat Sets",
    "price": 300,
    "sizes": {
      "S": "https://buy.stripe.com/5kQ00idLz4Tg4MCfU1fQI1V",
      "M": "https://buy.stripe.com/8x24gycHv1H44MC8rzfQI1W",
      "L": "https://buy.stripe.com/6oU28qdLzgBY5QG6jrfQI1X",
      "XL": "https://buy.stripe.com/3cIdR8aznetQ7YO37ffQI1Y",
      "XXL": "https://buy.stripe.com/aFa9AS6j7gBYdj84bjfQI1Z"
    }
  },
  "Varsity Set — Navy": {
    "name": "Varsity Set — Navy",
    "category": "Sweat Sets",
    "price": 300,
    "sizes": {
      "S": "https://buy.stripe.com/3cI00icHvetQ4MCcHPfQI20",
      "M": "https://buy.stripe.com/9B600ibDretQ4MCePXfQI21",
      "L": "https://buy.stripe.com/eVqfZgcHv71ocf4cHPfQI22",
      "XL": "https://buy.stripe.com/7sYdR8cHv5Xk7YO9vDfQI23",
      "XXL": "https://buy.stripe.com/bJe7sK7nb0D0a6WePXfQI24"
    }
  },
  "Mascot Lined Zip Hoodie": {
    "name": "Mascot Lined Zip Hoodie",
    "category": "Zip Hoodies",
    "price": 200,
    "sizes": {
      "S": "https://buy.stripe.com/28EfZg8rfclIbb0dLTfQI25",
      "M": "https://buy.stripe.com/3cI5kCaznbhEa6WgY5fQI26",
      "L": "https://buy.stripe.com/6oU8wOePD4Tg2Eu37ffQI27",
      "XL": "https://buy.stripe.com/8x2bJ022R71o1AqfU1fQI28",
      "XXL": "https://buy.stripe.com/5kQ7sKbDr0D07YOdLTfQI29"
    }
  },
  "Mascot Zip Hoodie": {
    "name": "Mascot Zip Hoodie",
    "category": "Zip Hoodies",
    "price": 200,
    "sizes": {
      "S": "https://buy.stripe.com/8x2dR8ePDadAbb00Z7fQI2a",
      "M": "https://buy.stripe.com/dRmcN4fTHfxU7YO4bjfQI2b",
      "L": "https://buy.stripe.com/4gM00iazn71o1Aq0Z7fQI2c",
      "XL": "https://buy.stripe.com/4gM6oG4aZfxUgvkcHPfQI2d",
      "XXL": "https://buy.stripe.com/eVqeVccHv0D07YO5fnfQI2e"
    }
  },
  "Heart Camo — Black": {
    "name": "Heart Camo — Black",
    "category": "Heart Camo",
    "price": 350,
    "sizes": {
      "S": "https://buy.stripe.com/5kQ14m7nbfxU1Aq7nvfQI2f",
      "M": "https://buy.stripe.com/4gM14m4aZdpMbb04bjfQI2g",
      "L": "https://buy.stripe.com/aFafZgdLz85s3Iy37ffQI2h",
      "XL": "https://buy.stripe.com/cNi9AS0YNclI7YOePXfQI2i",
      "XXL": "https://buy.stripe.com/5kQdR8dLzbhE4MC9vDfQI2j"
    }
  },
  "Heart Camo — Green": {
    "name": "Heart Camo — Green",
    "category": "Heart Camo",
    "price": 350,
    "sizes": {
      "S": "https://buy.stripe.com/9B628q8rf4Tg92SgY5fQI2k",
      "M": "https://buy.stripe.com/aFa3cuazn5Xk6UK9vDfQI2l",
      "L": "https://buy.stripe.com/5kQ9AScHv1H492SbDLfQI2m",
      "XL": "https://buy.stripe.com/3cI00ibDr2L86UKdLTfQI2n",
      "XXL": "https://buy.stripe.com/14A28q7nbclI2Eu8rzfQI2o"
    }
  },
  "Heart Camo — Pink": {
    "name": "Heart Camo — Pink",
    "category": "Heart Camo",
    "price": 350,
    "sizes": {
      "S": "https://buy.stripe.com/aFabJ036VetQ0wmePXfQI2p",
      "M": "https://buy.stripe.com/cNi3cu4aZ0D07YO4bjfQI2q",
      "L": "https://buy.stripe.com/14AaEWcHvetQ6UK7nvfQI2r",
      "XL": "https://buy.stripe.com/28EdR8bDr85sgvkfU1fQI2s",
      "XXL": "https://buy.stripe.com/aFaeVcazn3Pc6UKcHPfQI2t"
    }
  },
  "Heart Camo — Red": {
    "name": "Heart Camo — Red",
    "category": "Heart Camo",
    "price": 350,
    "sizes": {
      "S": "https://buy.stripe.com/9B66oGfTH2L83Iy5fnfQI2u",
      "M": "https://buy.stripe.com/5kQdR8bDr2L892S8rzfQI2v",
      "L": "https://buy.stripe.com/7sYbJ08rfetQ92S9vDfQI2w",
      "XL": "https://buy.stripe.com/5kQ28q8rfgBYa6W4bjfQI2x",
      "XXL": "https://buy.stripe.com/28E6oG4aZ1H47YOdLTfQI2y"
    }
  },
  "Heart Camo — Yellow": {
    "name": "Heart Camo — Yellow",
    "category": "Heart Camo",
    "price": 350,
    "sizes": {
      "S": "https://buy.stripe.com/4gM00i4aZ4Tg92S37ffQI2z",
      "M": "https://buy.stripe.com/4gMcN44aZbhEenc23bfQI2A",
      "L": "https://buy.stripe.com/eVqeVcaznadA1AqazHfQI2B",
      "XL": "https://buy.stripe.com/aFa00i36V71o4MC4bjfQI2C",
      "XXL": "https://buy.stripe.com/00wcN4bDrgBY0wmePXfQI2D"
    }
  },
  "Bigfoot Character Jeans": {
    "name": "Bigfoot Character Jeans",
    "category": "Denim",
    "price": 500,
    "sizes": {
      "S": "https://buy.stripe.com/00w28q8rffxU1AqfU1fQI2E",
      "M": "https://buy.stripe.com/28E14m36VetQenccHPfQI2F",
      "L": "https://buy.stripe.com/fZufZg22R4TgfrgazHfQI2G",
      "XL": "https://buy.stripe.com/28EfZg6j785s2Eu0Z7fQI2H",
      "XXL": "https://buy.stripe.com/8x26oG9vjdpM7YO4bjfQI2I"
    }
  },
  "Character Patch Jeans": {
    "name": "Character Patch Jeans",
    "category": "Denim",
    "price": 500,
    "sizes": {
      "S": "https://buy.stripe.com/00waEWfTHadAa6W8rzfQI2J",
      "M": "https://buy.stripe.com/5kQeVc5f30D07YOdLTfQI2K",
      "L": "https://buy.stripe.com/4gM5kC36V3Pc1Aq8rzfQI2L",
      "XL": "https://buy.stripe.com/5kQbJ05f385s1Aq9vDfQI2M",
      "XXL": "https://buy.stripe.com/dRm3cu36V2L83Iy4bjfQI2N"
    }
  },
  "Flaming Heart Family Jeans": {
    "name": "Flaming Heart Family Jeans",
    "category": "Denim",
    "price": 500,
    "sizes": {
      "S": "https://buy.stripe.com/28E28q4aZclI5QG37ffQI2O",
      "M": "https://buy.stripe.com/8x214mePD71oa6W9vDfQI2P",
      "L": "https://buy.stripe.com/7sY6oGbDretQa6W9vDfQI2Q",
      "XL": "https://buy.stripe.com/aFa28qgXLetQ3Iy23bfQI2R",
      "XXL": "https://buy.stripe.com/bJe9AS9vj85s0wm9vDfQI2S"
    }
  },
  "Heart Denim Hooded Jacket": {
    "name": "Heart Denim Hooded Jacket",
    "category": "Denim",
    "price": 500,
    "sizes": {
      "S": "https://buy.stripe.com/bJecN49vj1H47YO6jrfQI2T",
      "M": "https://buy.stripe.com/28E14m6j799w92S5fnfQI2U",
      "L": "https://buy.stripe.com/7sY6oGbDrdpMgvkazHfQI2V",
      "XL": "https://buy.stripe.com/6oU9AS6j7etQcf4bDLfQI2W",
      "XXL": "https://buy.stripe.com/bJebJ04aZ2L8a6WgY5fQI2X"
    }
  },
  "Heart Denim Hoodie": {
    "name": "Heart Denim Hoodie",
    "category": "Denim",
    "price": 500,
    "sizes": {
      "S": "https://buy.stripe.com/5kQdR8ePD99w6UKdLTfQI2Y",
      "M": "https://buy.stripe.com/7sYdR84aZgBY3IycHPfQI2Z",
      "L": "https://buy.stripe.com/cNi7sKfTHfxUgvk0Z7fQI30",
      "XL": "https://buy.stripe.com/9B67sKgXL1H4frg5fnfQI31",
      "XXL": "https://buy.stripe.com/eVq28q8rfbhE7YOePXfQI32"
    }
  },
  "Heart Denim Jacket": {
    "name": "Heart Denim Jacket",
    "category": "Denim",
    "price": 500,
    "sizes": {
      "S": "https://buy.stripe.com/7sY00i5f33Pca6WgY5fQI33",
      "M": "https://buy.stripe.com/4gM00i7nb71o1Aq0Z7fQI34",
      "L": "https://buy.stripe.com/00w7sK4aZ99w92SfU1fQI35",
      "XL": "https://buy.stripe.com/bJe9AS22R71o7YO9vDfQI36",
      "XXL": "https://buy.stripe.com/28EbJ0azn4Tgbb07nvfQI37"
    }
  },
  "Heart Patchwork Jeans": {
    "name": "Heart Patchwork Jeans",
    "category": "Denim",
    "price": 500,
    "sizes": {
      "S": "https://buy.stripe.com/eVqdR8gXL5Xk2EuePXfQI38",
      "M": "https://buy.stripe.com/dRm6oG22R1H40wm37ffQI39",
      "L": "https://buy.stripe.com/00wbJ09vjdpM0wmcHPfQI3a",
      "XL": "https://buy.stripe.com/aFa3cubDradAenc9vDfQI3b",
      "XXL": "https://buy.stripe.com/6oUaEW36V0D05QGcHPfQI3c"
    }
  },
  "Wing Patch Jeans": {
    "name": "Wing Patch Jeans",
    "category": "Denim",
    "price": 500,
    "sizes": {
      "S": "https://buy.stripe.com/00w7sKfTH1H4frg6jrfQI3d",
      "M": "https://buy.stripe.com/cNidR8fTHbhE2EufU1fQI3e",
      "L": "https://buy.stripe.com/14AdR822RbhEcf4azHfQI3f",
      "XL": "https://buy.stripe.com/5kQ4gy22RbhEgvk8rzfQI3g",
      "XXL": "https://buy.stripe.com/dRm6oG4aZ4TgencbDLfQI3h"
    }
  },
  "Heart Denim Full Set": {
    "name": "Heart Denim Full Set",
    "category": "Denim Sets",
    "price": 800,
    "sizes": {
      "S": "https://buy.stripe.com/fZu9ASaznetQ2Eu0Z7fQI3i",
      "M": "https://buy.stripe.com/3cIeVc5f3adA0wmazHfQI3j",
      "L": "https://buy.stripe.com/7sYeVc0YNbhE1Aq0Z7fQI3k",
      "XL": "https://buy.stripe.com/bJe7sKbDretQ92S7nvfQI3l",
      "XXL": "https://buy.stripe.com/9B68wOdLz71obb06jrfQI3m"
    }
  },
  "Astro Heart Tee": {
    "name": "Astro Heart Tee",
    "category": "T-Shirts",
    "price": 80,
    "sizes": {
      "S": "https://buy.stripe.com/28EbJ0gXL5Xk7YO5fnfQI3n",
      "M": "https://buy.stripe.com/3cI00i9vj71oencgY5fQI3o",
      "L": "https://buy.stripe.com/8x214mePD85s4MC37ffQI3p",
      "XL": "https://buy.stripe.com/3cIbJ00YNdpM2Eu8rzfQI3q",
      "XXL": "https://buy.stripe.com/3cIeVc7nb5Xka6W0Z7fQI3r"
    }
  },
  "Keychain Display Tee": {
    "name": "Keychain Display Tee",
    "category": "T-Shirts",
    "price": 80,
    "sizes": {
      "S": "https://buy.stripe.com/fZufZg7nb0D01Aq8rzfQI3s",
      "M": "https://buy.stripe.com/5kQ9ASazn1H4gvkfU1fQI3t",
      "L": "https://buy.stripe.com/5kQ7sKbDr0D092S7nvfQI3u",
      "XL": "https://buy.stripe.com/eVq4gygXL1H42Eu4bjfQI3v",
      "XXL": "https://buy.stripe.com/fZuaEWgXL4Tgbb0ePXfQI3w"
    }
  },
  "Heart Throne Long Sleeve": {
    "name": "Heart Throne Long Sleeve",
    "category": "Long Sleeves",
    "price": 100,
    "sizes": {
      "S": "https://buy.stripe.com/eVqbJ08rf71o7YO9vDfQI3x",
      "M": "https://buy.stripe.com/eVq14m0YNclI6UK6jrfQI3y",
      "L": "https://buy.stripe.com/3cIeVc36V99w1AqdLTfQI3z",
      "XL": "https://buy.stripe.com/fZu4gy4aZ4Tggvk9vDfQI3A",
      "XXL": "https://buy.stripe.com/3cI5kC0YN85sfrg9vDfQI3B"
    }
  },
  "Flare Pants — Black": {
    "name": "Flare Pants — Black",
    "category": "Flare Pants",
    "price": 140,
    "sizes": {
      "S": "https://buy.stripe.com/6oU3cuePDbhE92SazHfQI3C",
      "M": "https://buy.stripe.com/4gM00i9vj1H4a6WePXfQI3D",
      "L": "https://buy.stripe.com/aFa3cu6j71H45QGbDLfQI3E",
      "XL": "https://buy.stripe.com/bJe8wO22R4Tg0wmfU1fQI3F",
      "XXL": "https://buy.stripe.com/14AfZggXL2L8gvk7nvfQI3G"
    }
  },
  "Flare Pants — Burgundy": {
    "name": "Flare Pants — Burgundy",
    "category": "Flare Pants",
    "price": 140,
    "sizes": {
      "S": "https://buy.stripe.com/7sY6oG6j75Xk5QG23bfQI3H",
      "M": "https://buy.stripe.com/cNidR8bDr71o3IybDLfQI3I",
      "L": "https://buy.stripe.com/8x2eVcfTHclI92ScHPfQI3J",
      "XL": "https://buy.stripe.com/8x29AScHvfxU6UKePXfQI3K",
      "XXL": "https://buy.stripe.com/6oU7sKaznadAa6W5fnfQI3L"
    }
  },
  "Flare Pants — Gray": {
    "name": "Flare Pants — Gray",
    "category": "Flare Pants",
    "price": 140,
    "sizes": {
      "S": "https://buy.stripe.com/bJefZg6j7etQcf48rzfQI3M",
      "M": "https://buy.stripe.com/fZu4gyazn71o92S8rzfQI3N",
      "L": "https://buy.stripe.com/bJe6oG5f3fxU3Iy23bfQI3O",
      "XL": "https://buy.stripe.com/dRm3cufTHfxU7YOgY5fQI3P",
      "XXL": "https://buy.stripe.com/fZueVcazn85s2EudLTfQI3Q"
    }
  },
  "Flare Pants — Green": {
    "name": "Flare Pants — Green",
    "category": "Flare Pants",
    "price": 140,
    "sizes": {
      "S": "https://buy.stripe.com/28EbJ0cHvbhE0wm6jrfQI3R",
      "M": "https://buy.stripe.com/9B614mcHv99wa6WbDLfQI3S",
      "L": "https://buy.stripe.com/aFa9AS5f33Pc5QGgY5fQI3T",
      "XL": "https://buy.stripe.com/14A7sK9vj5Xk6UK6jrfQI3U",
      "XXL": "https://buy.stripe.com/bJefZg7nb2L84MC5fnfQI3V"
    }
  },
  "Flare Pants — Sage": {
    "name": "Flare Pants — Sage",
    "category": "Flare Pants",
    "price": 140,
    "sizes": {
      "S": "https://buy.stripe.com/28E4gy36VdpMdj8gY5fQI3W",
      "M": "https://buy.stripe.com/9B66oG7nbbhE7YObDLfQI3X",
      "L": "https://buy.stripe.com/aFa4gy9vjgBYgvk37ffQI3Y",
      "XL": "https://buy.stripe.com/4gM00i5f3fxUdj8cHPfQI3Z",
      "XXL": "https://buy.stripe.com/cNidR8azn71oa6W6jrfQI40"
    }
  },
  "Heart Keychain": {
    "name": "Heart Keychain",
    "category": "Accessories",
    "price": 40,
    "sizes": null,
    "link": "https://buy.stripe.com/00w00i22R4Tg4MC4bjfQI41"
  },
  "Heart Plush Figure": {
    "name": "Heart Plush Figure",
    "category": "Accessories",
    "price": 60,
    "sizes": null,
    "link": "https://buy.stripe.com/3cI00iePDfxUgvk37ffQI42"
  },
  "Heart Plush 4-Pack": {
    "name": "Heart Plush 4-Pack",
    "category": "Accessories",
    "price": 140,
    "sizes": null,
    "link": "https://buy.stripe.com/3cI00ibDr2L8dj86jrfQI43"
  }
};