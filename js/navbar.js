import { supa } from "../SupaBaseClient/supabase.js";
import { logout } from './javascript_helpers.js';

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  logout();
});