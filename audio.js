const musica = new Audio('./audio/soundtrack.mp3')
musica.loop = true
musica.volume = 0.2

// verifica se já estava tocando
if (localStorage.getItem('musicaAtiva') === 'true') {
    musica.play().catch(() => {})
}

// inicia música ao interagir
function iniciarMusicaGlobal() {
    musica.play().then(() => {
        localStorage.setItem('musicaAtiva', 'true')
    }).catch(() => {})
}

// eventos globais
document.addEventListener('click', iniciarMusicaGlobal, { once: true })
document.addEventListener('keydown', iniciarMusicaGlobal, { once: true })

// função opcional pra parar
function pararMusicaGlobal() {
    musica.pause()
    localStorage.setItem('musicaAtiva', 'false')
}