// Toggle sidebar functionality
let toggleSidebarButton;
let sidebar;
window.onload = function () {
    toggleSidebarButton = document.getElementById('toggleSidebar');
    sidebar = document.getElementById('sidebar');
    inflateSidebar();
}

function toggleSidebar() {
    if (sidebar.style.display === 'none') {
        toggleOpenSidebar();
    } else {
        toggleCloseSidebar();
    }
}

function toggleOpenSidebar() {
    sidebar.style.display = 'block';
    setTimeout(() => { // Use timeout to allow display change before sliding
        sidebar.style.right = '0'; // Slide in
    }, 10);
}

function toggleCloseSidebar() {
    sidebar.style.right = '-250px'; // Slide out
    setTimeout(() => {
        sidebar.style.display = 'none'; // Hide after animation
    }, 300); // Match this duration with the CSS transition
}

function inflateSidebar() {
    
    // Clear existing info rows
    const existingInfoRows = document.querySelectorAll('.fishInfoRow');
    existingInfoRows.forEach(row => row.remove());

    fishList.forEach((fish) => {
        displayFishInfo(fish)
    });
}

function displayFishInfo(fish) {

    const fishDiv = document.createElement('div');
    fishDiv.classList.add('fish-row')
    // Create a new div for the fish info
    const fishInfoDiv = document.createElement('div');
    fishInfoDiv.classList.add('fish-info');
    fishDiv.classList.add('fish-info-row');

    fishDiv.innerText = fish.fishInfo.type.name + " " + fish.fishInfo.id; // Display fish name
    fishDiv.addEventListener('click', () => {
        const height =  0 + 'px';
        fishInfoDiv.classList.toggle('inactive')
        if (fishInfoDiv.style.maxHeight){
            fishInfoDiv.style.maxHeight = null;
        } else {
            fishInfoDiv.style.maxHeight = fishInfoDiv.scrollHeight + "px";
        } 
    });

    const infoItems = fish.fishInfo.getInfo();
    infoItems.forEach(item => {
        const infoRow = document.createElement('div');
        infoRow.innerText = item;
        infoRow.classList.add("fish-info-row");
        fishInfoDiv.appendChild(infoRow);
    });
    const fishListElement = document.getElementById('fishList');
    fishListElement.appendChild(fishDiv);
    fishListElement.appendChild(fishInfoDiv);
}

function closeAllFishInfo() {
    const fishListElement = document.getElementById('fishList');
    for (const fishInfoDiv of fishListElement.children) {
        if (fishInfoDiv.firstElementChild) {
            fishInfoDiv.style.maxHeight = 0 + 'px';
        }
    }
}

window.addEventListener('click', (event) => {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickInsideButton = toggleSidebarButton.contains(event.target);

    if (!isClickInsideSidebar && !isClickInsideButton) {
        toggleCloseSidebar();
    }
});


// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

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

// Attach mouse event listeners
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);