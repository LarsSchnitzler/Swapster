import { logout } from './javascript_helpers.js';

function toggleNavbar(state) {
  if (state === false) {
    //open navbar
    const linkSection = document.getElementById("linkSection");
    linkSection.style.display = "flex";
    linkSection.style.flexDirection = "column";

    const navBar = document.getElementById("navBar");
    navBar.style.gap = "30px";
    navBar.style.flexDirection = "column";

    document.getElementById("burgerMenuImg").src = "../img/elements/burgerMenu_cross.svg";

    //set toggleNavbar variable
    toggleState = true;
  }
  else if (state === true){
    //close navbar
    const linkSection = document.getElementById("linkSection");
    linkSection.style.display = "none";
    linkSection.style.flexDirection = "row";

    const navBar = document.getElementById("navBar");
    navBar.style.gap = "0px";
    navBar.style.flexDirection = "row";

    document.getElementById("burgerMenuImg").src = "../img/elements/burgerMenu_lines.svg";

    //set toggleNavbar variable
    toggleState = false;
  }
}

let windowWidth = window.matchMedia('(max-width: 845px)');

document.getElementById("logout").addEventListener("click", () => {
  logout();
});

//navbar responsiveness

  //set toggleNavbar variable
  let toggleState = false; //false = navbar is closed, true = navbar is open

  // Initial check of screen size
  if (windowWidth.matches) {
    document.getElementById("linkSection").style.display = "none";
    document.getElementById("navBar").style.justifyContent = "center"; 

    //create a button
    let button = document.createElement("button");
    button.id = "burgerMenu";
    button.style.backgroundColor = "transparent";
    button.style.border = "none";
    button.style.outline = "none";
    button.style.padding = "0";
    button.style.height = "35px";
    button.style.cursor = "pointer";

    //give the button an image
    let img = document.createElement("img");
    img.src = "../img/elements/burgerMenu_lines.svg";
    img.style.height = "100%";
    img.id = "burgerMenuImg";
    
    button.appendChild(img);
    
    //add the button to the navbar
    let navBar = document.getElementById("navBar");
    navBar.appendChild(button);
    button.style.position = "absolute";
    button.style.right = "35px";
    button.style.top = "46px";

    //add event listener to the button
    button.addEventListener("click", () => {
      toggleNavbar(toggleState);
    });
  }
  else {
    document.getElementById("linkSection").style.display = "flex";
    document.getElementById("navBar").style.justifyContent = "space-between"; 
  }

  // Listen for changes in screen size
  windowWidth.addEventListener('change', w => {
    if (w.matches) {
      document.getElementById("linkSection").style.display = "none";
      document.getElementById("navBar").style.justifyContent = "center"; 

      //create a button
      let button = document.createElement("button");
      button.id = "burgerMenu";
      button.style.backgroundColor = "transparent";
      button.style.border = "none";
      button.style.outline = "none";
      button.style.padding = "0";
      button.style.height = "35px";
      button.style.cursor = "pointer";

      //give the button an image
      let img = document.createElement("img");
      img.src = "../img/elements/burgerMenu_lines.svg";
      img.style.height = "100%";
      img.id = "burgerMenuImg";
      
      button.appendChild(img);
      
      //add the button to the navbar
      let navBar = document.getElementById("navBar");
      navBar.appendChild(button);
      button.style.position = "absolute";
      button.style.right = "35px";
      button.style.top = "46px";

      //add event listener to the button
      button.addEventListener("click", () => {
        toggleNavbar(toggleState);
      });
    }
    else {
      //reset navbar, needs to be done before making linkSection visible
      toggleNavbar(true);

      document.getElementById("linkSection").style.display = "flex";
      document.getElementById("navBar").style.justifyContent = "space-between"; 

      //remove the button
      let button = document.getElementById("burgerMenu");
      button.remove();
    }
  });



