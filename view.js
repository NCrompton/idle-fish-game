// Toggle sidebar functionality
let toggleSidebarButton;
let sidebar;
let sidebarOption;
window.onload = function () {
    toggleSidebarButton = document.getElementById('toggleSidebar');
    sidebar = document.getElementById('sidebar');
    sidebarOption = document.getElementById('sidebarContent');
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
    
    sidebarOption.innerHTML = "";
    fishList.forEach((fish) => {
        const fishInfo = fish.fishInfo;
        const infoItems = fish.fishInfo.getInfo();
        infoItems.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            sidebarOption.appendChild(li);
        });
        
        const br = document.createElement('br');
        sidebarOption.appendChild(br);
    });
}

window.addEventListener('click', (event) => {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickInsideButton = toggleSidebarButton.contains(event.target);

    if (!isClickInsideSidebar && !isClickInsideButton) {
        toggleCloseSidebar();
    }
});
