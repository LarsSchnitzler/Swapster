import { supa } from "../SupaBaseClient/supabase.js";

export function authenticated() {
    
    const userResult = supa.auth.session();
    if (userResult !== null) {
        const { user } = userResult;
        return user;
    } else {
        console.error('User is not authenticated.');
        window.location.href = "/index.html";
    }
}