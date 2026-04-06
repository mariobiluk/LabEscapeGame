function iniciarJogo(modo) {
    sessionStorage.setItem('modoJogo', modo)

    document.getElementById('telaSelecao').style.display = 'none'
    document.getElementById('telaJogo').style.display = 'flex'

    const label = document.getElementById('labelModo')
    label.style.display = 'block'
    label.textContent = modo === 'multiplayer' ? 'MULTIPLAYER' : 'SOLO'

    if (modo === 'multiplayer') {
        document.body.classList.add('multiplayer')
        document.getElementById('des2').style.display = 'block'
    }

    // Carrega os scripts do jogo dinamicamente (garante que o DOM já tem os canvas)
    carregarScript('./models/Carro.js', () => {
        carregarScript('./index.js', () => {
            console.log('Scripts carregados!')
        })
    })
}

function carregarScript(src, callback) {
    const s = document.createElement('script')
    s.src = src
    s.onload = callback
    document.body.appendChild(s)
}