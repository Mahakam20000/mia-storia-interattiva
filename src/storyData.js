// src/storyData.js

export const storyData = [
  {
    id: 1,
    text: "Sei a casa ed hai fame.",
    options: [
      { text: "Apri il frigorifero", nextId: 2 },
      { text: "Apri la dispensa", nextId: 3 },
    ],
  },
  {
    id: 2,
    text: "Nel frigo ci sono dei wurstel.",
    options: [
      { text: "Mangia i wurstel", nextId: 4 },
      { text: "Non mangiare i wurstel", nextId: 5 },
    ],
  },
  {
    id: 3,
    text: "In dispensa trovi del pane in cassetta.",
    options: [
      { text: "Mangia il pane in cassetta", nextId: 6 },
      { text: "Non mangiare il pane in cassetta", nextId: 5 },
    ],
  },
  {
    id: 4,
    text: "Cucini i wurstel e li mangi. Sono molto buoni. Vai a letto sazio.",
    options: [],
  },
  {
    id: 5,
    text: "Non mangi nulla e vai a letto affamato.",
    options: [],
  },
  {
    id: 6,
    text: "Mangi il pane in cassetta. Non è il massimo ma almeno non hai più fame. Vai a letto.",
    options: [],
  },
];
