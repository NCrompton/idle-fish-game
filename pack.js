function initPack() {
    const packMenu = document.getElementById("pack-menu")
    packMenu.style.display = "none";
    packMenu.innerHTML = "";
    const packButton = document.getElementById("pack-button")

    packButton.addEventListener("click", () => {
        showpackMenu();
    }); 

    packMenu.addEventListener('click', (event) => {
        event.stopPropagation();
    })

    const itemTitles = document.querySelectorAll('.pack-item-title');
    itemTitles.forEach(title => {
        title.addEventListener('click', function() {
            const content = this.nextElementSibling; // Get the corresponding content div
            content.classList.toggle('active'); // Toggle the active class for animation
        });
    });

    
    // Fetch the packs data
    fetch(DRAW_PACK_JSON_URL)
        .then(response => response.json())
        .then(data => displayPacks(data))
        .catch(error => console.error('Error fetching the packs:', error));
}

function showpackMenu() {
    document.getElementById("pack-menu").style.display = "flex"
    document.getElementById("main-menu").style.display = "none"
}

function inflatepackMenu() {

}

// Function to display the packs
function displayPacks(packs) {
    const packsContainer = document.getElementById('pack-menu');
    
    packs.forEach(pack => {
        // Create a pack container
        const packDiv = document.createElement('div');
        packDiv.className = 'pack-item';
        
        // Add pack title with price and level
        const packTitle = document.createElement('div');
        packTitle.className = 'pack-item-title';
        packTitle.textContent = `${pack.name} - Price: $${pack.price}, Level: ${pack.level}`;
        
        const packConfirmButton = document.createElement('div');
        packConfirmButton.className = "pack-confirm-button";
        packConfirmButton.textContent = "✔";
        packTitle.appendChild(packConfirmButton);

        packConfirmButton.addEventListener("click", (e) => {
            e.stopPropagation();
            selectPack(pack);
        })

        packDiv.appendChild(packTitle);
        
        packDiv.addEventListener('click', function() {
            const content = this.nextElementSibling; // Get the corresponding content div
            content.classList.toggle('active'); // Toggle the active class for animation
        });
        
        packsContainer.appendChild(packDiv);
        
        const fishContentDiv = document.createElement('div');
        fishContentDiv.className = 'pack-item-content';

        // Add fish types
        pack.fishTypes.forEach(fishType => {
            const fish = getFishType(fishType.id);
            const fishDiv = document.createElement('div');
            fishDiv.className = 'pack-item-content-row';
            fishDiv.textContent = `Fish Type: ${fish.name}, Family: ${fish.family}`;
            fishContentDiv.appendChild(fishDiv);
        });

        packsContainer.appendChild(fishContentDiv);
    });
}

function selectPack(pack) {
    let raritySum = 0;
    let cardList = [];
    pack.fishTypes.forEach((fishType) => {
        raritySum += fishType.rarity;
        for (let i = 0; i < fishType.rarity; i++) {
            cardList.push(fishType.id);
        }
    })
    const draw = Math.floor(Math.random() * raritySum);
    const drawedFishType = getFishType(cardList[draw]);
    const newFish = addFish(drawedFishType);
    previewPackResult(newFish);
}

let previewCamera;
let previewScene;
let previewRenderer;

function previewPackResult(fish) {
    const previewDiv = document.createElement("div");
    previewDiv.className = "pop-up-menu";
    previewDiv.id = "preview-menu";

    previewDiv.addEventListener('click', (e) => {e.stopPropagation();});

    const popupOverlay = document.createElement("div");
    popupOverlay.className = "overlay";

    popupOverlay.style.zIndex = 20;

    popupOverlay.appendChild(previewDiv);
    popupOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log(popupOverlay);
        popupOverlay.remove();
    })

    create2DPreviewScene(fish, previewDiv);
    previewDiv.appendChild(previewRenderer.domElement);

    const previewTextDiv = document.createElement("div");
    previewTextDiv.className = "preview-text";
    previewTextDiv.textContent = `You draw a ${fish.fishInfo.type.name}, Size: ${fish.fishInfo.size}`;

    previewDiv.appendChild(previewTextDiv);
    
    const overlay = document.getElementById('main-overlay');
    overlay.appendChild(popupOverlay);
}

function create2DPreviewScene(fish, previewDiv) {
    
    const previewFish = fish.clone();
    previewFish.position.x = 0;
    previewFish.position.y = 0;
    previewFish.scale.x = 1/previewFish.geometry.parameters.radius;
    previewFish.scale.y = 1/previewFish.geometry.parameters.radius;

    console.log(previewFish.scale.y);

    create2DRenderer(previewDiv);
    previewScene.add(previewFish);
    
    animatePreviewFish(previewRenderer, previewScene, previewCamera, previewFish);
}

function create2DRenderer(previewDiv) {
    previewScene = new THREE.Scene();
    // previewScene.background = new THREE.Color(0xffffff);
    previewCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    previewRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    previewRenderer.setSize(200, 200);
    previewCamera.position.z = 10;

    return previewRenderer;
}

// Animation loop
function animatePreviewFish(r, s, c, fish) {
    requestAnimationFrame(animatePreviewFish);

    // Rotate the cube
    // fish.rotation.x += 0.01;
    // fish.rotation.y += 0.01;

    previewRenderer.render(previewScene, previewCamera);
}