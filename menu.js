// PARTÍCULAS
const pContainer = document.getElementById('particles')

for (let i = 0; i < 20; i++) {
    let p = document.createElement('div')
    p.className = 'particle'
    p.style.left = Math.random() * 100 + '%'
    p.style.bottom = '0px'
    p.style.animationDuration = (4 + Math.random() * 4) + 's'
    pContainer.appendChild(p)
}

// Tenta fullscreen ao clicar em qualquer lugar
document.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {})
    }
}, { once: true })

// Some o aviso depois de 6 segundos
setTimeout(() => {
    const aviso = document.getElementById("aviso")
    if (aviso) aviso.style.display = "none"
}, 6000)

const musica = document.getElementById("musicaMenu")
musica.volume = 0.2

let musicaIniciada = false

function iniciarMusica() {
    if (!musicaIniciada) {
        musica.play()
        musicaIniciada = true
    }
}

document.addEventListener("keydown", iniciarMusica)
document.addEventListener("click", iniciarMusica, { once: true })

function pararMusica() {
    musica.pause()
}