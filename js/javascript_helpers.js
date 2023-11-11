import { supa } from "../SupaBaseClient/supabase.js";

export async function authenticated_sendBack() {

    const userResult = await supa.auth.session();

    if (userResult !== null) {
        const { user } = userResult;
        return user;
    } else {
        console.error('User is not authenticated.');
        window.location.href = "/log-in.html";
    }
}

export async function authenticated() {   

    const authenticationStatus = false; 
    const userResult = await supa.auth.session();

    if (userResult !== null) {
        const { user } = userResult;
        const authenticationStatus = true;
        return [authenticationStatus, user];
    } else {
        return [authenticationStatus,'no user object'];
    }
}

export function logout() {
    supa.auth.signOut()
    .then(() => {
      window.location.href = "/log-in.html"; 
    })
    .catch(error => {
      console.error("Error logging out:", error);
    });
}