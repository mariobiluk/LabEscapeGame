let canvas = document.getElementById('des')
let des = canvas.getContext('2d')
canvas.width = 1200
canvas.height = 700

/// LIMITES DA RUA
const RUA_TOPO = 200    // teto do pulo
const RUA_BASE = 560    // chão da imagem

// PLAYER — chaoY = RUA_BASE - altura (55)
let personagem = new Personagem(120, RUA_BASE - 65, 80, 125, './imagens_novas/andando01.png')

// INIMIGOS
let inimigo1 = new InimigoAnimado(900, RUA_BASE - 55, 80, 125, './imagens_novas/zumbi01.png')

// CARROS
let carro1 = new InimigoAnimado(2200, RUA_BASE - 55, 80, 125, './img/fase1/carro1_001.png')

// OBSTÁCULOS
let obstaculo1 = new Obstaculo(3200, RUA_BASE - 25, 70, 95, './imagens_novas/obstaculo.png')
let obstaculo2 = new Obstaculo(5200, RUA_BASE - 25, 60, 85, './imagens_novas/obstaculo.png')

// ITENS
let vidaItem = new Coletavel(1600, RUA_BASE - 50, 45, 45)
let boostItem = new Boost(4000, RUA_BASE - 50, 50, 50)

// BOSS
let boss = new Boss(6500, RUA_BASE - 45, 120, 100, './imagens_novas/boss01.png')

let txtPontos = new Text()
let txtVida = new Text()

// SONS
let motor = new Audio('./audio/soundtrack.mp3')
let somPersonagem = new Audio('./audio/fase1/shadow.wav')
let somCarro = new Audio('./audio/zombie.mp3')
let somObstaculo = new Audio('./audio/obstaculo.mp3')
let coletarSom = new Audio('./audio/life_colectable.mp3')
let somBoost = new Audio('./audio/boost.mp3')
let somBoss = new Audio('./audio/boss.mp3')
let somGameOver = new Audio('./audio/game_over_sound.mp3')
let musicaGameOver = new Audio('./audio/game_over_fundo_.mp3')

musicaGameOver.loop = true

// volumes (ajusta se quiser)
somGameOver.volume = 1.0
musicaGameOver.volume = 0.5

motor.loop = true

// 👇 ADICIONA AQUI
motor.volume = 0.5

somPersonagem.volume = 0.8
somCarro.volume = 0.8
somObstaculo.volume = 0.7
coletarSom.volume = 0.9
somBoost.volume = 0.9
somBoss.volume = 1.0

motor.loop = true

let jogando = true
let gameOverTocado = false
let nivelDificuldade = 1
let shake = 0
let dx = 0

// 🔥 DOIS FUNDOS
let imgFundo1 = new Image()
let imgFundo2 = new Image()
let fundo1Carregado = false
let fundo2Carregado = false

imgFundo1.onload = () => { fundo1Carregado = true; console.log('Fundo 1 carregado!') }
imgFundo1.onerror = () => { console.error('ERRO: background01 não carregou! Caminho: ./imagens_novas/background01.png'); fundo1Carregado = false }
imgFundo1.src = './imagens_novas/fundo01.jpg'

imgFundo2.onload = () => { fundo2Carregado = true; console.log('Fundo 2 carregado!') }
imgFundo2.onerror = () => { console.error('ERRO: background02 não carregou! Caminho: ./imagens_novas/background02.png'); fundo2Carregado = false }
imgFundo2.src = './imagens_novas/fundo02.jpg'

let fundoX = 0

// RESIZE
function redimensionar() {
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
}
window.addEventListener('resize', redimensionar)
redimensionar()

// CONTROLES
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
    }
    if (jogando) { motor.play() }
    if (e.key === 'w' || e.key === 'ArrowUp') { personagem.pular() }
    if (e.key === 'd' || e.key === 'ArrowRight') { dx = 1 }
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'd' || e.key === 'ArrowRight') { dx = 0 }
})

// DIFICULDADE
function atualizarDificuldade() {
    let novoNivel = Math.floor(personagem.pontos / 15) + 1
    if (novoNivel > nivelDificuldade) {
        nivelDificuldade = novoNivel
        inimigo1.vel += 0.5
        carro1.vel += 0.6
        obstaculo1.vel += 0.4
        obstaculo2.vel += 0.4
        boss.vel += 0.8
        vidaItem.delaySpawn -= 20
        boostItem.delaySpawn -= 20
    }
}

// COLISÕES
function verificarColisoes() {
    if (personagem.colisao(inimigo1)) {
        somPersonagem.play()
        personagem.vida--
        personagem.tomarDano()
        inimigo1.reiniciar()
        shake = 10
    }
    if (personagem.colisao(carro1)) {
        somCarro.play()
        personagem.vida--
        personagem.tomarDano()
        carro1.reiniciar()
        shake = 10
    }
    if (personagem.colisao(obstaculo1)) {
        somObstaculo.play()
        personagem.aplicarSlow()
        obstaculo1.reiniciar()
        shake = 3
    }
    if (personagem.colisao(obstaculo2)) {
        somObstaculo.play()
        personagem.aplicarSlow()
        obstaculo2.reiniciar()
        shake = 3
    }
    if (vidaItem.ativo && personagem.colisao(vidaItem)) {
        coletarSom.play()
        personagem.vida++
        vidaItem.reiniciar()
    }
    if (boostItem.ativo && personagem.colisao(boostItem)) {
        somBoost.play()
        personagem.aplicarBoost()
        boostItem.reiniciar()
    }
    if (boss.ativo && personagem.colisao(boss)) {
        somBoss.play()
        personagem.vida -= 3
        personagem.tomarDano()
        boss.reiniciar()
        shake = 20
    }
}

// PONTOS
function pontuar() {
    let objs = [inimigo1, carro1]
    objs.forEach(obj => {
        if (personagem.passou(obj)) {
            personagem.pontos += 10
            obj.reiniciar()
        }
    })
}

// 🎨 DESENHAR
function desenhar() {

    if (shake > 0) {
        des.save()
        des.translate(Math.random() * 10 - 5, Math.random() * 10 - 5)
        shake--
    }

    // 🔥 FUNDO COM DOIS BACKGROUNDS EM ALTERNÂNCIA
    if (fundo1Carregado && fundo2Carregado) {
        fundoX -= dx * personagem.velocidadeAtual

        // Loop infinito: cada "slot" tem largura 1200, total do ciclo = 2400
        if (fundoX <= -2400) {
            fundoX = 0
        }

        // Posições dos 3 slots necessários para cobrir a tela sem corte
        // Slot A: posição fundoX          → imagem alternada por índice
        // Slot B: posição fundoX + 1200   → imagem alternada por índice
        // Slot C: posição fundoX + 2400   → imagem alternada por índice

        let slots = [fundoX, fundoX + 1200, fundoX + 2400]

        slots.forEach((x, i) => {
            // Calcula qual imagem usar neste slot com base na posição absoluta no ciclo
            // O ciclo tem 2 imagens, cada uma com 1200px
            // Índice global do slot no ciclo:
            let slotIndex = i  // 0, 1, 2
            // Como fundoX vai de 0 a -2400, o slot 0 começa em fundoX,
            // o slot 1 em fundoX+1200, etc.
            // Queremos: slot 0 = bg01, slot 1 = bg02, slot 2 = bg01 (repetição)
            let imgEscolhida = (slotIndex % 2 === 0) ? imgFundo1 : imgFundo2
            des.drawImage(imgEscolhida, x, 0, 1200, 700)
        })

    } else {
        // Fallback quando as imagens não carregam
        des.fillStyle = '#2c3e50'
        des.fillRect(0, 0, 1200, 700)
        des.fillStyle = '#34495e'
        des.fillRect(0, RUA_TOPO, 1200, RUA_BASE - RUA_TOPO)
        des.fillStyle = '#f1c40f'
        for (let i = 0; i < 20; i++) {
            des.fillRect(i * 80, RUA_TOPO + ((RUA_BASE - RUA_TOPO) / 2), 40, 5)
        }
        des.fillStyle = 'white'
        des.font = '20px Arial'
        des.fillText('Fundo não carregou! Verifique o caminho da imagem.', 400, 50)
    }

    if (jogando) {
        inimigo1.desenhar()
        carro1.desenhar()
        obstaculo1.desenhar()
        obstaculo2.desenhar()

        if (vidaItem.ativo) vidaItem.desenhar()
        if (boostItem.ativo) boostItem.desenhar()
        if (boss.ativo) boss.desenhar()

        personagem.desenhar()

        // 🔥 TEXTOS MOVIDOS PARA BAIXO (y aumentado)
        // ===== HUD ESTILIZADO =====

        // FUNDO TRANSPARENTE (caixa)
        des.fillStyle = 'rgba(0,0,0,0.4)'
        des.fillRect(20, 20, 260, 110)

        // BORDA NEON
        des.strokeStyle = '#39ff14'
        des.lineWidth = 2
        des.strokeRect(20, 20, 260, 110)

        // VIDA
        des.fillStyle = '#ff3b3b'
        des.font = 'bold 22px Orbitron'
        des.shadowColor = '#ff3b3b'
        des.shadowBlur = 10
        des.fillText(`VIDA: ${personagem.vida}`, 40, 55)

        // PONTOS
        des.fillStyle = '#ffff00'
        des.shadowColor = '#ffff00'
        des.shadowBlur = 10
        des.fillText(`PONTOS: ${personagem.pontos}`, 40, 80)

        // NÍVEL
        des.fillStyle = '#39ff14'
        des.shadowColor = '#39ff14'
        des.shadowBlur = 10
        des.fillText(`NÍVEL: ${nivelDificuldade}`, 40, 105)

        // RESET SHADOW
        des.shadowBlur = 0

        // BARRA DE VIDA
        des.fillStyle = '#222'
        des.fillRect(40, 115, 200, 10)

        des.fillStyle = '#ff3b3b'
        des.fillRect(40, 115, personagem.vida * 40, 10) // ajusta conforme max vida

        des.strokeStyle = '#39ff14'
        des.strokeRect(40, 115, 200, 10)

        if (personagem.boostTimer > 0) {
            des.fillStyle = 'cyan'
            des.font = '20px Arial'
            des.fillText('BOOST ATIVO!', canvas.width / 2 - 50, 130)
        }
        if (personagem.slowTimer > 0) {
            des.fillStyle = 'orange'
            des.font = '20px Arial'
            des.fillText('SLOW ATIVO!', canvas.width / 2 - 50, 130)
        }

    } else {
        // FUNDO ESCURO COM OVERLAY
        des.fillStyle = 'rgba(0,0,0,0.75)'
        des.fillRect(0, 0, canvas.width, canvas.height)

        // BORDA NEON
        des.strokeStyle = '#39ff14'
        des.lineWidth = 2
        des.strokeRect(150, 150, canvas.width - 300, canvas.height - 300)

        // TÍTULO GAME OVER
        des.fillStyle = '#39ff14'
        des.font = 'bold 60px Orbitron'
        des.textAlign = 'center'
        des.shadowColor = '#39ff14'
        des.shadowBlur = 20
        des.fillText('GAME OVER', canvas.width / 2, 260)

        // RESET SHADOW
        des.shadowBlur = 0

        // PONTUAÇÃO
        des.fillStyle = '#ffffff'
        des.font = '28px Rajdhani'
        des.fillText(`PONTOS: ${personagem.pontos}`, canvas.width / 2, 340)

        // INSTRUÇÕES
        des.fillStyle = '#39ff14'
        des.font = '20px Rajdhani'
        des.fillText('PRESSIONE F5 PARA REINICIAR', canvas.width / 2, 420)
        des.fillText('ESC PARA VOLTAR AO MENU', canvas.width / 2, 460)

        // DETALHE ESTÉTICO (linhas)
        des.strokeStyle = '#39ff14'
        des.beginPath()
        des.moveTo(canvas.width / 2 - 150, 300)
        des.lineTo(canvas.width / 2 + 150, 300)
        des.stroke()
    }

    if (shake > 0) des.restore()
}

// ATUALIZAR
function atualizar() {
    if (!jogando) return

    personagem.mover()
    personagem.animar()
    personagem.atualizarEstado()

    if (dx != 0) {
        inimigo1.mover()
        carro1.mover()
        obstaculo1.mover()
        obstaculo2.mover()
        vidaItem.mover()
        boostItem.mover()
        boss.mover()
    }

    inimigo1.animar()
    carro1.animar()
    vidaItem.animar()
    boostItem.animar()
    boss.animar()

    verificarColisoes()
    pontuar()
    atualizarDificuldade()

    if (personagem.vida <= 0 && !gameOverTocado) {
        jogando = false
        motor.pause()

        // 🔥 TOCA OS DOIS SONS
        somGameOver.play()
        musicaGameOver.play()

        gameOverTocado = true
    }
}

// LOOP
function main() {
    des.clearRect(0, 0, 1200, 700)
    desenhar()
    atualizar()
    requestAnimationFrame(main)
}

window.addEventListener('load', () => {
    console.log('Página carregada, iniciando jogo...')
    main()
})

// VOLTAR PARA MENU COM ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        window.location.href = "./index.html";
    }
});