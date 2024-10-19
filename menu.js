function resetMenu() {
    document.getElementById('main-menu').style.display = "none";
    document.getElementById("pack-menu").style.display = "none";
    document.getElementById('overlay').style.display = "none";
}

function showMainMenu() {
    document.getElementById('overlay').style.display = "flex";
    document.getElementById('main-menu').style.display = "flex";
}

function initMenu() {
    // Optional: Close the box when clicking on the overlay
    overlay.addEventListener('click', function() {
        resetMenu();
    });

    document.getElementById("main-menu").addEventListener("click", (event) => {
        event.stopPropagation();
    })
}