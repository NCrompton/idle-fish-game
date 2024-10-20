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
    const existingInfo = document.querySelectorAll('.fish-container');
    existingInfo.forEach(row => row.remove());

    fishList.forEach((fish) => {
        displayFishInfo(fish)
    });
}

function displayFishInfo(fish) {

    const fishContainerDiv = document.createElement('div');
    fishContainerDiv.className = "fish-container"
    
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

    fishContainerDiv.addEventListener("mouseover", (e) => {
        fish.material.color.set(0xFFFFFF);
    });
    fishContainerDiv.addEventListener("mouseleave", (e) => {
        fish.material.color.set(fish.fishInfo.color);
    })

    const infoItems = fish.fishInfo.getInfo();
    infoItems.forEach(item => {
        const infoRow = document.createElement('div');
        infoRow.innerText = item;
        infoRow.classList.add("fish-info-row");
        fishInfoDiv.appendChild(infoRow);
    });
    const fishListElement = document.getElementById('fishList');
    fishContainerDiv.appendChild(fishDiv);
    fishContainerDiv.appendChild(fishInfoDiv);
    fishListElement.appendChild(fishContainerDiv);
}

function closeAllFishInfo() {
    const fishListElement = document.getElementById('fishList');
    for (const fishInfoDiv of fishListElement.children) {
        if (fishInfoDiv.firstElementChild) {
            fishInfoDiv.style.maxHeight = 0 + 'px';
        }
    }
}

function initSidebar() {
    inflateSidebar();
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
}
