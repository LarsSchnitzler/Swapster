import { supa } from "../SupaBaseClient/supabase.js";

const navbarToggler = document.querySelector(".navbar-toggler");
const navbarMenu = document.querySelector(".navbar ul");
const navbarLinks = document.querySelectorAll(".navbar a");
const logoutButton = document.getElementById("logout");

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

logoutButton.addEventListener("click", () => {
  supa.auth.signOut()
    .then(() => {
      window.location.href = "/index.html"; // Replace with the appropriate URL
    })
    .catch(error => {
      // Handle any errors that may occur during logout
      console.error("Error logging out:", error);
    });
});