import { accessToken, handleRedirect, generateCodeVerifier, sha256, clientId, scopes, redirectUri, searchSpotify } from './utils.js';
import { loadEmbed } from './player.js';

const loginBtn = document.getElementById('loginBtn');
loginBtn.onclick = async ()=>{
    const codeVerifier = await generateCodeVerifier();
    localStorage.setItem('pkce_verifier', codeVerifier);
    const codeChallenge = await sha256(codeVerifier);
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
    window.location.href = authUrl;
};

// On load: handle redirect
handleRedirect();

// Search
const searchBtn = document.getElementById('searchBtn');
searchBtn.onclick = async ()=>{
    const query = document.getElementById('searchInput').value.trim();
    if(!query) return;
    const resultsEl = document.getElementById('results');
    resultsEl.innerHTML='Loading...';
    const items = await searchSpotify(query);
    resultsEl.innerHTML='';
    items.forEach(it=>{
        const card = document.createElement('div'); card.className='card';
        card.innerHTML = `<img src="${it.image}"><div class="title">${it.title}</div><div class="sub">${it.sub}</div>`;
        card.onclick = ()=> loadEmbed(it);
        resultsEl.appendChild(card);
    });
};

// Enter key triggers search
document.getElementById('searchInput').addEventListener('keydown', e=>{
    if(e.key==='Enter') searchBtn.click();
});
