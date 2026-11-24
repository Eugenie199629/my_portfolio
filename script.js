// De voorbeeldknoppen krijgen pas een bestemming zodra je eigen projectlinks bekend zijn.
document.querySelectorAll('[data-placeholder="true"]').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        alert('Hier komt straks de link naar jouw eigen project.');
    });
});


/* HAMBURGERMENU */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
        const isOpen = mainNav.classList.toggle("menu-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Sluit navigatiemenu" : "Open navigatiemenu"
        );

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }
    });
}

