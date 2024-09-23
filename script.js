// Dati di esempio per la storia
const storyData = {
    id: 1,
    title: "Inizio dell'avventura",
    image: "https://example.com/start.jpg",
    text: "Ti trovi all'ingresso di una caverna misteriosa. Cosa fai?",
    choices: [
        {
            id: 2,
            title: "Entra nella caverna",
            image: "https://example.com/cave.jpg",
            text: "Entri nella caverna oscura...",
            choices: [
                // Altre scelte qui
            ]
        },
        {
            id: 3,
            title: "Esplora i dintorni",
            image: "https://example.com/surroundings.jpg",
            text: "Decidi di esplorare l'area circostante...",
            choices: [
                // Altre scelte qui
            ]
        }
    ]
};

let currentNode = storyData;

// Funzione per creare l'albero usando D3.js
function createTree(data) {
    const width = document.getElementById('tree-container').offsetWidth;
    const height = document.getElementById('tree-container').offsetHeight;

    const svg = d3.select("#tree-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},50)`);

    const tree = d3.tree().size([width - 100, height - 100]);

    const root = d3.hierarchy(data);
    tree(root);

    const link = g.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y));

    const node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("r", 10)
        .on("click", (event, d) => updateStory(d.data));

    node.append("text")
        .attr("dy", ".35em")
        .attr("y", d => d.children ? -20 : 20)
        .style("text-anchor", "middle")
        .text(d => d.data.title);
}

// Funzione per aggiornare la storia
function updateStory(node) {
    currentNode = node;
    document.getElementById("story-title").textContent = node.title;
    document.getElementById("story-image").src = node.image;
    document.getElementById("story-text").textContent = node.text;
    document.getElementById("story-panel").classList.remove("hidden");

    // Aggiorna la vista mobile
    document.getElementById("mobile-title").textContent = node.title;
    document.getElementById("mobile-image").src = node.image;
    document.getElementById("mobile-text").textContent = node.text;

    const choicesContainer = document.getElementById("mobile-choices");
    choicesContainer.innerHTML = "";
    node.choices.forEach(choice => {
        const button = document.createElement("button");
        button.className = "choice-button";
        button.innerHTML = `
            <img src="${choice.image}" alt="${choice.title}">
            <span>${choice.title}</span>
        `;
        button.onclick = () => updateStory(choice);
        choicesContainer.appendChild(button);
    });
}

// Inizializza l'applicazione
window.onload = () => {
    createTree(storyData);
    updateStory(storyData);
};

// Gestione del ridimensionamento della finestra
window.onresize = () => {
    document.getElementById("tree-container").innerHTML = "";
    createTree(storyData);
};