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

    // Riduciamo l'altezza dell'albero all'80% dell'altezza del contenitore
    const treeHeight = height * 0.8;
    
    // Calcoliamo il margine verticale per centrare l'albero
    const verticalMargin = (height - treeHeight) / 2;

    const svg = d3.select("#tree-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${verticalMargin})`);

    // Funzione per costruire la gerarchia
    function buildHierarchy(nodeId, visited = new Set()) {
        if (visited.has(nodeId)) {
            // Se il nodo è già stato visitato, ritorniamo un riferimento
            return { id: nodeId, title: data.nodes[nodeId].title, isReference: true };
        }
        visited.add(nodeId);
        const node = data.nodes[nodeId];
        return {
            id: node.id,
            title: node.title,
            children: node.choices.map(childId => buildHierarchy(childId, new Set(visited)))
        };
    }

    const hierarchy = buildHierarchy(data.rootId);
    const root = d3.hierarchy(hierarchy);

    const tree = d3.tree().size([width - 100, treeHeight]).separation((a, b) => (a.parent == b.parent ? 1 : 1.2) * 20);
    tree(root);

    // Creiamo i link, includendo quelli per i nodi di riferimento
    const link = g.selectAll(".link")
        .data(root.links().concat(root.descendants().filter(d => d.data.isReference).map(d => ({source: d.parent, target: d}))))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y));

    const node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", d => "node" + (d.data.isReference ? " reference" : ""))
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("r", 10)
        .on("click", (event, d) => updateStory(data.nodes[d.data.id]));

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

    // Centra inizialmente l'albero
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