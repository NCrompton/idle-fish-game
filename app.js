// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a fish tank (using a box geometry)
const tankGeometry = new THREE.BoxGeometry(10, 5, 5);
const tankMaterial = new THREE.MeshBasicMaterial({ color: 0x1E90FF, transparent: true, opacity: 0.5 });
const tank = new THREE.Mesh(tankGeometry, tankMaterial);
scene.add(tank);

// Function to create a fish
function createFish(color) {
    const fishGeometry = new THREE.SphereGeometry(0.2, 16, 16);
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
    const color = colors[i % colors.length];
    const fish = createFish(color);
    fish.fishInfo = {
        id: i + 1,
        color: color,
        speed: fish.speed.toFixed(2), // Store fish properties
    };
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

for (let i = 0; i < initFishCount; i++) {
    addFish();
}

// Set camera position
camera.position.z = 10;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    fishList.forEach(fish => {
        fish.position.x += fish.speed * fish.direction;

        // Check boundaries
        if (fish.position.x > 4.5 || fish.position.x < -4.5) {
            fish.direction *= -1; // Reverse direction
            
            fish.speed = Math.random() * 0.02 + 0.02;
        }

        // Optional: Add a little vertical movement
        fish.position.y = Math.sin(Date.now() * 0.001 + fishList.indexOf(fish)) * 1; // Different vertical movement per fish
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

window.addEventListener('click', (event) => {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(fishList);
    // console.log(intersects.length);

    const fishOptions = document.getElementById('fishOptions');
    fishOptions.innerHTML = ''; // Clear previous options

    if (intersects.length > 0) {
        const clickedFish = intersects[0].object;
        const fishInfo = clickedFish.fishInfo;
        
        const infoItems = [
            `Fish ID: ${fishInfo.id}`,
            `Color: #${fishInfo.color.toString(16).padStart(6, '0')}`,
            `Speed: ${fishInfo.speed}`
        ];

        infoItems.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            fishOptions.appendChild(li);
        });
        // Show the info box when a fish is clicked
        document.getElementById('infoBox').style.display = 'block';
    } else {
        mouse.x = ((event.clientX / window.innerWidth) * 2 - 1)*5;
        mouse.y = (-(event.clientY / window.innerHeight) * 2 + 1)*5;
        mouse.z = 0;
        // console.log(mouse);
        fishList.some(fish => {
            // const distance = fish.position.distanceTo(camera.position.clone().add(new THREE.Vector3(mouse.x * 10, mouse.y * 10, 0)));
            const distance = fish.position.distanceTo(mouse);
            
            if (distance < clickDistanceThreshold) {
                const fishInfo = fish.fishInfo;
                
                const infoItems = [
                    `Fish ID: ${fishInfo.id}`,
                    `Color: #${fishInfo.color.toString(16).padStart(6, '0')}`,
                    `Speed: ${fishInfo.speed}`
                ];

                infoItems.forEach(item => {
                    const li = document.createElement('li');
                    li.innerText = item;
                    fishOptions.appendChild(li);
                });

                document.getElementById('infoBox').style.display = 'block';
                return;
            } else {
                document.getElementById('infoBox').style.display = 'none';
            }
        });
    }
});

window.addEventListener('mousemove', (event) => {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(fishList);

    resetFishColors(); // Reset colors before highlighting

    if (intersects.length > 0) {
        const highlightedFish = intersects[0].object;
        highlightedFish.material.color.set(highlightColor); // Change color on highlight
    } 
});

// Start animation
animate();