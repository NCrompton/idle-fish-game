// Toggle sidebar functionality
let toggleSidebarButton;
let sidebar;
window.onload = function () {
    toggleSidebarButton = document.getElementById('toggleSidebar');
    sidebar = document.getElementById('sidebar');
    
    initAllViewProperty();
    initAllEvent();
    
    initFish();
    initSidebar();
    initMenu();
    // initPack();
}

function initAllViewProperty() {
    
}

function initAllEvent() {
    const showBoxButton = document.getElementById('show-box-button');
    
    showBoxButton.addEventListener('click', (event) => {
        showMainMenu();
    });

    // Attach mouse event listeners
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
}

let draggedFish;
let isDragging = false;

const onMouseDown = (event) => {
    isDragging = true;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
 
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(fishList);

    const fishOptions = document.getElementById('fishOptions');
    fishOptions.innerHTML = ''; // Clear previous options

    if (intersects.length > 0) {
        draggedFish = intersects[0].object;
    }
};

const onMouseMove = (event) => {
    if (isDragging && draggedFish) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster again to get the new position
        raycaster.setFromCamera(mouse, camera);

        // Calculate intersection with a plane
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(planeZ, point);

        // Update the position of the selected fish
        if (validXPosition(point))
            draggedFish.position.x = point.x;
        if (validYPosition(point))
            draggedFish.position.y = point.y;

        showOnInfobox(draggedFish);
    }
};

const onMouseUp = () => {
    isDragging = false;
    draggedFish = null;
    dismissInfoBox();
};
