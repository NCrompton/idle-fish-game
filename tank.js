// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a fish tank (using a box geometry)
const tankGeometry = new THREE.BoxGeometry(10, 5, 5);
const tankMaterial = new THREE.MeshStandardMaterial({ color: 0x1E90FF, transparent: true, opacity: 0.5 });
const tank = new THREE.Mesh(tankGeometry, tankMaterial);
scene.add(tank);

// Add OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Add lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Function to create a fish
function createFish(color, size) {
    const fishGeometry = new THREE.SphereGeometry(size, 16, 16);
    const fishMaterial = new THREE.MeshStandardMaterial({ color: color });
    const fish = new THREE.Mesh(fishGeometry, fishMaterial);

    // Random initial position within the tank
    fish.position.x = Math.random() * 8 - 4; // x between -4 and 4
    fish.position.y = Math.random() * 4 - 2; // y between -2 and 2
    // fish.position.z = Math.random() * 2 - 1; // z between -1 and 1
    fish.speed = Math.random() * 0.05 + 0.02; // Speed of the fish
    fish.direction = 1; // 1 for right, -1 for left

    return fish;
}

function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

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
