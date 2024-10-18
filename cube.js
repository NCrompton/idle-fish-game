// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Set up lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040)); // Soft white light

// Set camera position
camera.position.z = 5;

// Handle dragging
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

const onMouseDown = (event) => {
    isDragging = true;
};

const onMouseMove = (event) => {
    if (isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y,
        };

        // Update the cube's position
        cube.position.x += deltaMove.x * 0.01;
        cube.position.y -= deltaMove.y * 0.01; // Invert Y for correct dragging direction
    }

    previousMousePosition = { x: event.clientX, y: event.clientY };
};

const onMouseUp = () => {
    isDragging = false;
};

// Attach mouse event listeners
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Optional rotation for visual effect
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
