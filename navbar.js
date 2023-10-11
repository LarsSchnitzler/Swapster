

const navbarToggler = document.querySelector(".navbar-toggler");
const navbarMenu = document.querySelector(".navbar ul");
const navbarLinks = document.querySelectorAll(".navbar a");

navbarToggler.addEventListener("click", navbarTogglerClick);

function navbarTogglerClick() {
  navbarToggler.classList.toggle("open-navbar-toggler");
  navbarMenu.classList.toggle("open");
}

navbarLinks.forEach(elem => elem.addEventListener("click", navbarLinkClick));

function navbarLinkClick() {
  if(navbarMenu.classList.contains("open")) {
    navbarToggler.click();
  }
}


// JavaScript
const box1 = document.getElementById("box1");
const box2 = document.getElementById("box2");
const box3 = document.getElementById("box3");

// Ändere den Inhalt der Flexboxen
box1.textContent = "Box 1";
box2.textContent = "Box 2";
box3.textContent = "Box 3";

// Ändere die Hintergrundfarben der Flexboxen
box1.style.backgroundColor = "#e34f26";
box2.style.backgroundColor = "#002561";
box3.style.backgroundColor = "#333";