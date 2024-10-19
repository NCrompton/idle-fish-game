// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a fish tank (using a box geometry)
const tankGeometry = new THREE.BoxGeometry(10, 5, 5);
const tankMaterial = new THREE.MeshBasicMaterial({ color: 0x1E90FF, transparent: true, opacity: 0.5 });
const tank = new THREE.Mesh(tankGeometry, tankMaterial);
scene.add(tank);

// Function to create a fish
function createFish(color, size) {
    const fishGeometry = new THREE.SphereGeometry(size, 16, 16);
    const fishMaterial = new THREE.MeshBasicMaterial({ color: color });
    const fish = new THREE.Mesh(fishGeometry, fishMaterial);

    // Random initial position within the tank
    fish.position.x = Math.random() * 8 - 4; // x between -4 and 4
    fish.position.y = Math.random() * 4 - 2; // y between -2 and 2
    // fish.position.z = Math.random() * 2 - 1; // z between -1 and 1
    fish.speed = Math.random() * 0.05 + 0.02; // Speed of the fish
    fish.direction = 1; // 1 for right, -1 for left

    return fish;
}

function resetFishStat(fish) {
    fish.speed = Math.random() * 0.02 + 0.00;
    return fish;
}

function addFish() {
    let i = fishList.length;
    let typeNum = fishTypes.length;
    let fishType = fishTypes[Math.floor(Math.random() * (typeNum))];
    // const color = colors[i % colors.length];
    console.log(fishType);
    const sizeRange = fishType.maxSize - fishType.minSize;
    const size = fishType.minSize + (Math.random()*sizeRange);
    const fish = createFish(fishType.color, size*0.1);
    
    const price = fishType.priceTier*size**2 + Math.random();
    let fishObj = new Fish(i, fishType, size, 0, price, fishType.color)

    fish.fishInfo = fishObj;

    fishList.push(fish);
    scene.add(fish);
}

function resetFishColors() {
    fishList.forEach(fish => {
        fish.material.color.set(fish.fishInfo.color);
    });
}

// Create an array of fish
const initFishCount = 5; // Number of fish
const fishList = [];
const colors = [0xFF4500, 0xFFD700, 0x00FF00, 0x1E90FF, 0xFF69B4]; // Array of colors

function initFish() {
    for (let i = 0; i < initFishCount; i++) {
        addFish();
    }
    inflateSidebar();
}

// Set camera position
camera.position.z = 10;

const MAX_X_POSITION = 4.5;
const MIN_X_POSITION = -4.5;
function validXPosition(fishPos) {
    return fishPos.x < MAX_X_POSITION && fishPos.x > MIN_X_POSITION;
}
const MAX_Y_POSITION = 3;
const MIN_Y_POSITION = -2.5;
function validYPosition(fishPos) {
    return fishPos.y < MAX_Y_POSITION && fishPos.y > MIN_Y_POSITION;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    fishList.forEach(fish => {
        if (draggedFish === fish) return;
        fish.position.x += fish.speed * fish.direction;

        // Check boundaries
        if (!validXPosition(fish.position)) {
            fish.direction = Math.sign(fish.position.x)*-1; // Reverse direction
            
            fish.speed = Math.random() * 0.02 + 0.02;
        }

        // Optional: Add a little vertical movement
        if (validYPosition(fish.position)) {
            fish.position.y += Math.sin(Date.now() * 0.001 + fishList.indexOf(fish)) * 0.02; // Different vertical movement per fish
        } else {
            // fish.position.y += Math.sin(Date.now() * -0.001 + fishList.indexOf(fish)) * 0.02; // Different vertical movement per fish
            if (fish.position.y > MAX_Y_POSITION) {
                fish.position.y -= fish.speed;
            } else if (fish.position.y < MIN_Y_POSITION) 
                fish.position.y += fish.speed;
        }
    });

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clickDistanceThreshold = 1;
const highlightColor = 0xFFFFFF;

window.addEventListener('mousemove', (event) => {
    if (isDragging) return;
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(fishList);
    // console.log(intersects.length);

    if (intersects.length > 0) {
        const clickedFish = intersects[0].object;
        showOnInfobox(clickedFish);

        const highlightedFish = intersects[0].object;
        highlightedFish.material.color.set(highlightColor); // Change color on highlight
    } else {
        resetFishColors(); // Reset colors before highlighting
        dismissInfoBox();
    }
});

function showOnInfobox(fish) {
    const fishOptions = document.getElementById('fishOptions');
    fishOptions.innerHTML = ''; // Clear previous options

    const fishInfo = fish.fishInfo;
        
    const infoItems = fishInfo.getInfo();

    infoItems.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item;
        fishOptions.appendChild(li);
    });

    // Show the info box when a fish is clicked
    document.getElementById('infoBox').style.display = 'block';
}

function dismissInfoBox() {
    document.getElementById('infoBox').style.display = 'none';
}


// Start animation
animate();