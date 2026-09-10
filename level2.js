export const Level2 = {
  name: "1-2",
  map: [
    "                                                                                                                                                                ",
    "                                                                                                                                                                ",
    "                                                                                                                                                                ",
    "                                                                                                                                                                ",
    "                                                                                                                                                            ",
    "                   23232                                           23232                                                                                          ",
    "                                                                                                                                                            ",
    "                                                                                                                                                          ",
    "              23232                                                                                                                                        ",
    "                                                                                                                                                             ",
    "                                                                                                                                                  ",
    "                                              2222                                                                                                          ",
    "                                                                                                                                                             ",
    "1111111111111111111111111      11111111111              1111111111111111     11111111111111     1111111111111111111111111111111111",
    "1111111111111111111111111      11111111111              1111111111111111     11111111111111     1111111111111111111111111111111111"
  ].map(row => row.split('').map(char => (char === ' ' ? 0 : parseInt(char, 10)))),

  pipes: [
    { x: 18, y: 11, height: 2 },
    { x: 35, y: 10, height: 3 },
    { x: 68, y: 9,  height: 4 },  
    { x: 85, y: 10, height: 3 }, 
  ],
  scenery: [
    { type: 'cloud', x: 240,  y: 80  },
    { type: 'cloud', x: 700,  y: 60  },
    { type: 'cloud', x: 1300, y: 100 },
    { type: 'cloud', x: 1900, y: 70  },
    { type: 'bush',  x: 440,  y: 384 },
    { type: 'bush',  x: 1040, y: 384 },
    { type: 'bush',  x: 1120, y: 384 } 
  ],

  getEnemies: () => [
    { x: 760,  y: 384, w: 28, h: 28, vx: -1.8, vy: 0, grounded: true, alive: true },
    { x: 1240, y: 384, w: 28, h: 28, vx: -1.5, vy: 0, grounded: true, alive: true },
    { x: 1320, y: 384, w: 28, h: 28, vx: -1.5, vy: 0, grounded: true, alive: true },
    { x: 1360, y: 384, w: 28, h: 28, vx: -2.0, vy: 0, grounded: true, alive: true },
    { x: 1536, y: 320, w: 28, h: 28, vx: -1.4, vy: 0, grounded: true, alive: true },
    { x: 2020, y: 384, w: 28, h: 28, vx: -1.6, vy: 0, grounded: true, alive: true },
    { x: 2368, y: 384, w: 28, h: 28, vx: -1.8, vy: 0, grounded: true, alive: true }, 
    { x: 4000, y: 384, w: 28, h: 28, vx: -1.5, vy: 0, grounded: true, alive: true },
    { x: 4640, y: 384, w: 28, h: 28, vx: -1.8, vy: 0, grounded: true, alive: true }  
  ],

  getCoins: () => [
    { x: 440,  y: 220 }, { x: 472,  y: 220 }, { x: 504,  y: 220 },
    { x: 820,  y: 180 }, { x: 852,  y: 180 }, { x: 884,  y: 180 },
    { x: 1220, y: 200 }, { x: 1252, y: 200 },
  
  ]
};