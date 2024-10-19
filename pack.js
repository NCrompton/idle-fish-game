function initPack() {
    const packMenu = document.getElementById("pack-menu")
    packMenu.style.display = "none";
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
        packDiv.appendChild(packTitle);
        
        // Add fish types
        pack.fishTypes.forEach(fish => {
            const fishDiv = document.createElement('div');
            fishDiv.className = 'pack-item-content';
            fishDiv.textContent = `Fish Type ID: ${fish.id}, Rarity: ${fish.rarity}`;
            packDiv.appendChild(fishDiv);
        });
        
        packsContainer.appendChild(packDiv);
    });
}