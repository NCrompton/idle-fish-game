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

// Set camera position
camera.position.z = 10;

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

renderer.domElement.addEventListener('mousemove', (event) => {
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