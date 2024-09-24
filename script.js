// Dati di esempio per la storia
const storyData = {
    nodes: {
        1: {
            id: 1,
            title: "Inizio dell'avventura",
            image: "images/1.jpg",
            text: "Ti trovi all'ingresso di una caverna misteriosa. Cosa fai?",
            choices: [2, 3, 4]
        },
        2: {
            id: 2,
            title: "Entra nella caverna",
            image: "images/2.jpg",
            text: "Entri nella caverna oscura. L'aria è umida e fredda.",
            choices: [4, 5]
        },
        3: {
            id: 3,
            title: "Esplora i dintorni",
            image: "images/3.jpg",
            text: "Decidi di esplorare l'area circostante. Noti un sentiero nascosto.",
            choices: [6, 7]
        },
        4: {
            id: 4,
            title: "Accendi una torcia",
            image: "images/4.jpg",
            text: "Accendi una torcia. La luce rivela antiche iscrizioni sulle pareti.",
            choices: [8]
        },
        5: {
            id: 5,
            title: "Procedi al buio",
            image: "images/5.jpg",
            text: "Decidi di procedere al buio. Inciampi su qualcosa...",
            choices: [8]  // Questo nodo condivide la stessa scelta del nodo 4
        },
        6: {
            id: 6,
            title: "Segui il sentiero",
            image: "images/6.jpg",
            text: "Segui il sentiero nascosto. Ti conduce a una radura segreta.",
            choices: []
        },
        7: {
            id: 7,
            title: "Torna all'ingresso della caverna",
            image: "images/7.jpg",
            text: "Decidi di tornare all'ingresso della caverna. Cosa fai ora?",
            choices: [2, 3]  // Questo nodo riporta alle scelte iniziali
        },
        8: {
            id: 8,
            title: "Trovi un tesoro",
            image: "images/8.jpg",
            text: "Hai trovato un antico tesoro! La tua avventura finisce qui.",
            choices: []
        }
    },
    rootId: 1
};

let currentNode = storyData;

// Funzione per creare l'albero usando D3.js
function createTree(data, currentNodeId) {
    const width = document.getElementById('tree-container').offsetWidth;
    const height = document.getElementById('tree-container').offsetHeight;

    // Pulisci il contenitore
    d3.select("#tree-container").selectAll("*").remove();

    const svg = d3.select("#tree-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const currentNode = data.nodes[currentNodeId];
    const nodeData = [
        { id: currentNodeId, title: currentNode.title, x: 0, y: 0 }
    ];

    const linkData = [];

    // Aggiungi i nodi delle scelte
    const choiceCount = currentNode.choices.length;
    const radius = Math.min(width, height) / 4;
    currentNode.choices.forEach((choiceId, index) => {
        const angle = (index / choiceCount) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        nodeData.push({ id: choiceId, title: data.nodes[choiceId].title, x, y });
        linkData.push({ source: { x: 0, y: 0 }, target: { x, y } });
    });

    // Crea i collegamenti
    g.selectAll(".link")
        .data(linkData)
        .enter().append("line")
        .attr("class", "link")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    // Crea i nodi
    const node = g.selectAll(".node")
        .data(nodeData)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .on("click", (event, d) => updateStory(data.nodes[d.id]));

    node.append("circle")
        .attr("r", 10);

    node.append("text")
        .attr("dy", ".35em")
        .attr("y", d => d.id === currentNodeId ? -20 : 20)
        .style("text-anchor", "middle")
        .text(d => d.title);
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
    node.choices.forEach(choiceId => {
        const choice = storyData.nodes[choiceId];
        const button = document.createElement("button");
        button.className = "choice-button";
        button.innerHTML = `
            <img src="${choice.image}" alt="${choice.title}">
            <span>${choice.title}</span>
        `;
        button.onclick = () => updateStory(choice);
        choicesContainer.appendChild(button);
    });

    // Aggiorna la visualizzazione dell'albero
    createTree(storyData, node.id);
}


// Inizializza l'applicazione
window.onload = () => {
    createTree(storyData, storyData.rootId);
    updateStory(storyData.nodes[storyData.rootId]);
};

// Gestione del ridimensionamento della finestra
window.onresize = () => {
    createTree(storyData, currentNode.id);
};