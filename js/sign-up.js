import { supa } from "../SupaBaseClient/supabase.js";
const user = supa.auth.user();
console.log(user)




console.log("user.id: ",user.id)
async function checkExistingData() {
    const {data, error } = await supa.from('profiles').select().eq('id', user.id);
    return data;
}  

const existingData = await checkExistingData() 

console.log(existingData)


// redirect off ** 


// if(existingData.first_name !== null) 
// {
//     window.location.href = 'http://127.0.0.1:5500/userprofile.html';
// }


const signUpButton = document.getElementById('sign-up-button');

signUpButton.addEventListener('click', async (event) => {
    event.preventDefault();
    signUp();
});


async function signUp() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;

  

const { data1, error1} = await supa.from("profiles").update({'first_name': firstName, 'last_name' : lastName, 'date_of_birth' : dateOfBirth}).eq('id', user.id)


// // Check if the user data exists in the profiles table
// async function checkUserProfile() {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('id')
//       .eq('first_name', firstName)
//       .eq('last_name', lastName)
//       .eq('date_of_birth', dateOfBirth);
  
//     if (error) {
//       console.error('Error checking user profile:', error);
//       return;
//     }

//     




//   if (data.length === 0) {
//     // User data does not exist, insert it
//     insertUserProfile();
//   } else {
//     // User data exists, redirect to the userprofile.html
//     window.location.href = 'http://127.0.0.1:5500/userprofile.html';
//   }
}



// Insert user profile if it doesn't exist
async function insertUserProfile() {
  const { data, error } = await supabase.from('profiles').upsert([
    {
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
    },
  ]);

  if (error) {
    console.error('Error inserting user profile:', error);
    return;
  }



  // redirect off


//   if (data) {
//     // Successfully inserted the user profile, redirect to userprofile.html
//     window.location.href = 'http://127.0.0.1:5500/userprofile.html';
//   }
}

// Call the checkUserProfile function to initiate the process
// checkUserProfile();
if (user){
    console.log('eingeloggt');}
    
    else {
    console.log('nicht eingeloggt')
    window.location.href = 'http://127.0.0.1:5500/log-in.html';
    }

    supa.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
            console.log("User signed in: ", session.user);
            updateUserStatus(session.user);

            
        } else if (event === "SIGNED_OUT") {
            console.log("User signed out");
            updateUserStatus(null);
        }
      });