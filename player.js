export function loadEmbed(item){
    const player = document.getElementById('player');
    const url = `https://open.spotify.com/embed/${item.type}/${item.id}`;
    player.src = url;
}
