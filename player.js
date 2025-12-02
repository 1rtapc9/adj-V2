let queueList=[];
export function loadEmbed(item){
  const player=document.getElementById('player');
  const url=`https://open.spotify.com/embed/${item.type}/${item.id}`;
  player.src=url;
  addToQueue(item);
}

function addToQueue(item){
  queueList=[...queueList.filter(i=>i.id!==item.id),item].slice(-8);
  renderQueue();
}

function renderQueue(){
  const queueEl=document.getElementById('queue');
  queueEl.innerHTML='';
  queueList.forEach(it=>{
    const chip=document.createElement('div'); chip.className='chip'; chip.textContent=it.title;
    chip.onclick=()=>loadEmbed(it);
    queueEl.appendChild(chip);
  });
}
