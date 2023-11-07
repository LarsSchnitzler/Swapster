import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated_sendBack } from './javascript_helpers.js';

const user = await authenticated_sendBack();
const queryRate_PriTolChange = 1000; //in ms
const match_color = "#2E7985";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);


const otherUser = urlParams.get('otheruser');

const ownProduct = urlParams.get('ownproduct');

const otherProduct = urlParams.get('otherproduct');

document.getElementById('other-user-id').innerHTML = "Other User: " + otherUser;
document.getElementById('own-product-id').innerHTML = "Own Product: " + ownProduct;
document.getElementById('other-product-id').innerHTML = "Other Product: " + otherProduct;

