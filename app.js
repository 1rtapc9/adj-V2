import { accessToken, handleRedirect, generateCodeVerifier, sha256, clientId, scopes, redirectUri, searchSpotify } from './utils.js';
import { loadEmbed } from './player.js';

const loginBtn=document.getElementById('loginBtn');
loginBtn.onclick=async ()=>{
  const codeVerifier=await generateCodeVerifier();
  localStorage.setItem('pkce_verifier',codeVerifier);
  const codeChallenge=await sha256(codeVerifier);
  const authUrl=`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
  window.location.href=authUrl;
};
handleRedirect();

const searchInput=document.getElementById('searchInput');
const searchBtn=document.getElementById('searchBtn');
const resultsEl=document.getElementById('results');
let offset=0;
let currentQuery='';

async function performSearch(query, reset=true){
  if(reset){resultsEl.innerHTML='';offset=0;currentQuery=query;}
  const items=await searchSpotify(query,offset,12);
  items.forEach(it=>{
    const card=document.createElement('div'); card.className='card';
    card.innerHTML=`<img src="${it.image}"><div class="title">${it.title}</div><div class="sub">${it.sub}</div><div class="play-hover">▶</div>`;
    card.querySelector('.play-hover').onclick=()=>loadEmbed(it);
    resultsEl.appendChild(card);
  });
  offset+=12;
}

// Search
searchBtn.onclick=()=>performSearch(searchInput.value.trim());
searchInput.addEventListener('keydown',e=>{if(e.key==='Enter') searchBtn.click();});

// Infinite scroll
resultsEl.addEventListener('scroll', async ()=>{
  if(resultsEl.scrollTop + resultsEl.clientHeight >= resultsEl.scrollHeight-50){
    await performSearch(currentQuery,false);
  }
});
