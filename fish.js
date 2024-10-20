class FishType {
    constructor(name, minSize, maxSize, priceTier, color, family, growingSpeed, typeId) {
        this.name = name;
        this.minSize = minSize;
        this.maxSize = maxSize;
        this.priceTier = priceTier;
        this.color = color;
        this.family = family;
        this.growingSpeed = growingSpeed;
        this.typeId = typeId;
    }
}

class Fish {
    constructor(id, type, size, level, price, color) {
        this.id = id;
        this.type = type; // Instance of FishType
        this.size = size;
        this.level = level;
        this.price = price;
        this.color = color;
    }

    getString() {
        return `Fish ID: ${this.id}, Type: ${this.type.name}, Size: ${this.size}, Level: ${this.level}, Price: $${this.price}`;
    }

    getInfo() {
        return [
            `Fish ID: ${this.id}`,
            // `Color: #${this.color.toString(16).padStart(6, '0')}`,
            `Type: ${this.type.name}`,
            `Price: ${this.price}`,
            `Level: ${this.level}`,
            `Size: ${this.size}`,
        ];
    }
}

const fishTypes = [];
function getFishType(id) {
    return fishTypes.filter((fishType) => fishType.typeId.toString() === id.toString())[0];
}

function resetFishStat(fish) {
    fish.speed = Math.random() * 0.02 + 0.00;
    return fish;
}

function addFish(fishType) {
    let i = fishList.length;
    let typeNum = fishTypes.length;
    // const color = colors[i % colors.length];
    console.log(fishType);
    const sizeRange = fishType.maxSize - fishType.minSize;
    const size = fishType.minSize + (Math.random()*sizeRange);
    const fish = createFish(fishType.color, size*0.1);
    
    const price = Math.floor(fishType.priceTier*size**2 + Math.random());
    let fishObj = new Fish(i, fishType, size, 0, price, fishType.color)

    fish.fishInfo = fishObj;

    fishList.push(fish);
    scene.add(fish);
    inflateSidebar();
    return fish;
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

function addInitFish() {
    for (let i = 0; i < initFishCount; i++) {
        let fishType = fishTypes[Math.floor(Math.random() * (fishTypes.length))];
        addFish(fishType);
    }
    inflateSidebar();
}

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

function initFish() {
    // Fetch fish types from JSON file
    fetch(FISH_JSON_URL)
        .then(response => response.json())
        .then(data => {
            data.forEach(typeData => {
                const fishType = new FishType(
                    typeData.Name,
                    typeData.MinSize,
                    typeData.MaxSize,
                    typeData.PriceTier,
                    typeData.Color,
                    typeData.Family,
                    typeData.GrowingSpeed,
                    typeData.Id,
                );
                fishTypes.push(fishType);
            });
    
            // Create fish instances using the fish types
            createFishInstances();
            addInitFish();
            initPack();
        })
        .catch(error => console.error('Error loading fish types:', error));
}

function randomAddFish() {
    let fishType = fishTypes[Math.floor(Math.random() * (fishTypes.length))];
    addFish(fishType);
}

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