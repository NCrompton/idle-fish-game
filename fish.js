class FishType {
    constructor(name, minSize, maxSize, priceTier, color, family) {
        this.name = name;
        this.minSize = minSize;
        this.maxSize = maxSize;
        this.priceTier = priceTier;
        this.color = color;
        this.family = family;
    }
}

class Fish {
    constructor(id, type, size, level, price) {
        this.id = id;
        this.type = type; // Instance of FishType
        this.size = size;
        this.level = level;
        this.price = price;
    }

    getInfo() {
        return `Fish ID: ${this.id}, Type: ${this.type.name}, Size: ${this.size}, Level: ${this.level}, Price: $${this.price}`;
    }
}

const fishTypes = [];

// Fetch fish types from JSON file
fetch('fishTypes.json', {mode: "cors"})
    .then(response => response.json())
    .then(data => {
        data.forEach(typeData => {
            const fishType = new FishType(
                typeData.Name,
                typeData.MinSize,
                typeData.MaxSize,
                typeData.PriceTier,
                typeData.Color,
                typeData.Family
            );
            fishTypes.push(fishType);
        });

        // Create fish instances using the fish types
        createFishInstances();
    })
    .catch(error => console.error('Error loading fish types:', error));

// Function to create fish instances
function createFishInstances() {
    const fishList = [];
    
    // Example: Creating 5 fish with random attributes based on fish types
    for (let i = 0; i < 5; i++) {
        const randomType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
        const size = Math.random() * (randomType.maxSize - randomType.minSize) + randomType.minSize;
        const level = Math.floor(Math.random() * 10) + 1; // Random level between 1 and 10
        const price = randomType.priceTier; // Base price from the type

        const fish = new Fish(i + 1, randomType, size, level, price);
        fishList.push(fish);
        console.log(fish.getInfo()); // Log fish info
    }

    // You can now add fishList to the scene or perform other actions as needed
}