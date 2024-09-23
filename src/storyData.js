// src/storyData.js

export const storyData = [
  {
    id: 1,
    text: "Sei a casa ed hai fame.",
    image: "images/1.jpg",
    options: [
      { text: "Apri il frigorifero", nextId: 2, image: "images/2.jpg" },
      { text: "Apri la dispensa", nextId: 3, image: "images/3.jpg" },
    ],
  },
  {
    id: 2,
    text: "Nel frigo ci sono dei wurstel.",
    image: "images/2.jpg",
    options: [
      { text: "Mangia i wurstel", nextId: 4, image: "images/4.jpg" },
      { text: "Non mangiare i wurstel", nextId: 5, image: "images/5.jpg" },
    ],
  },
  {
    id: 3,
    text: "In dispensa trovi del pane in cassetta.",
    image: "images/3.jpg",
    options: [
      { text: "Mangia il pane in cassetta", nextId: 6, image: "images/6.jpg" },
      { text: "Non mangiare il pane in cassetta", nextId: 5, image: "images/5.jpg" },
    ],
  },
  {
    id: 4,
    text: "Cucini i wurstel e li mangi. Sono molto buoni. Vai a letto sazio.",
    image: "images/4.jpg",
    options: [],
  },
  {
    id: 5,
    text: "Non mangi nulla e vai a letto affamato.",
    image: "images/5.jpg",
    options: [],
  },
  {
    id: 6,
    text: "Mangi il pane in cassetta. Non è il massimo ma almeno non hai più fame. Vai a letto.",
    image: "images/6.jpg",
    options: [],
  },
];




export const graphData = {
  nodes: storyData.map(node => ({
    id: node.id,
    name: node.text,
    image: node.image,
  })),
  links: storyData.flatMap(node =>
    node.options.map(option => ({
      source: node.id,
      target: option.nextId,
    }))
  ),
};
