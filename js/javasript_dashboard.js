import { supa } from "../SupaBaseClient/supabase.js";
const initialUser = supa.auth.user();
console.log(initialUser);