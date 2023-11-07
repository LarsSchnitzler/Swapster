// Get references to the elements you want to control
const editProfileDiv = document.getElementById('editProfile');
const svgButton = document.querySelector('.svg-button');
const cancelBtn = document.getElementById('editProfile_Cancel');
const saveBtn = document.getElementById('editProfile_Save');

// Initially hide the editProfile div
editProfileDiv.style.display = 'none';

// Add click event listener to the SVG button
svgButton.addEventListener('click', () => {
    if (editProfileDiv.style.display === 'none') {
        editProfileDiv.style.display = 'block'; // Show the editProfile div
    } else {
        editProfileDiv.style.display = 'none'; // Hide the editProfile div
    }
});

// Add click event listener to the Cancel button
cancelBtn.addEventListener('click', () => {
    editProfileDiv.style.display = 'none'; // Hide the editProfile div
});

// Add click event listener to the Save button
saveBtn.addEventListener('click', () => {
    editProfileDiv.style.display = 'none'; // Hide the editProfile div
});