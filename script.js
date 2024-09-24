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
function createTree(data) {
    const width = document.getElementById('tree-container').offsetWidth;
    const height = document.getElementById('tree-container').offsetHeight;
    const treeHeight = height * 0.8;
    const verticalMargin = (height - treeHeight) / 2;

    const svg = d3.select("#tree-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${verticalMargin})`);

    // Crea una mappa di tutti i nodi
    const nodeMap = new Map(Object.entries(data.nodes).map(([id, node]) => [id, { ...node, children: [] }]));

    // Costruisci le relazioni genitore-figlio
    nodeMap.forEach(node => {
        node.choices.forEach(childId => {
            if (nodeMap.has(childId.toString())) {
                node.children.push(nodeMap.get(childId.toString()));
            }
        });
    });

    // Crea la gerarchia D3
    const root = d3.hierarchy(nodeMap.get(data.rootId.toString()));

    // Crea il layout dell'albero
    const treeLayout = d3.tree().size([width - 100, treeHeight]);
    treeLayout(root);

    // Crea i collegamenti
    const link = g.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y));

    // Crea i nodi
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

    // Aggiungi zoom e pan
    const zoom = d3.zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom);

    // Centra l'albero inizialmente
    const initialScale = 0.8;
    const initialTranslateX = (width - width * initialScale) / 2;
    const initialTranslateY = (height - treeHeight * initialScale) / 2;
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialTranslateX, initialTranslateY).scale(initialScale));
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