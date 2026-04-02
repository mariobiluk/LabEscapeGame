// ==================== CONFIGURAÇÃO DOS CANVAS ====================
const MODO = sessionStorage.getItem('modoJogo') || 'solo'
const MULTIPLAYER = MODO === 'multiplayer'

const canvas1 = document.getElementById('des1')
const ctx1 = canvas1.getContext('2d')
canvas1.width = 1200
canvas1.height = MULTIPLAYER ? 350 : 700

let canvas2 = null
let ctx2 = null
if (MULTIPLAYER) {
    canvas2 = document.getElementById('des2')
    ctx2 = canvas2.getContext('2d')
    canvas2.width = 1200
    canvas2.height = 350
}

// ==================== CONSTANTES DE LIMITE DA RUA ====================
const RUA_TOPO = MULTIPLAYER ? 100 : 200
const RUA_BASE = MULTIPLAYER ? 280 : 560

// ==================== JOGADOR 1 ====================
let personagem = new Personagem(120, RUA_BASE - 65, 80, 125, './imagens_novas/andando01.png')

let inimigo1   = new InimigoAnimado(900,  RUA_BASE - 55, 80, 125, './imagens_novas/zumbi01.png')
let obstaculo1 = new Obstaculo(3200, RUA_BASE - 25, 70, 95, './imagens_novas/obstaculo.png')
let obstaculo2 = new Obstaculo(5200, RUA_BASE - 25, 60, 85, './imagens_novas/obstaculo.png')
let vidaItem   = new Coletavel(1600, RUA_BASE - 50, 45, 45)
let boostItem  = new Boost(4000,    RUA_BASE - 50, 50, 50)
let boss       = new Boss(6500,     RUA_BASE - 45, 120, 100)

// ==================== JOGADOR 2 (só instanciado no multiplayer) ====================
let personagem2 = null
let inimigo2    = null
let obstaculo3  = null
let obstaculo4  = null
let vidaItem2   = null
let boostItem2  = null
let boss2       = null

if (MULTIPLAYER) {
    personagem2 = new Personagem2(120, RUA_BASE - 65, 80, 125)
    inimigo2    = new InimigoAnimado(1100, RUA_BASE - 55, 80, 125, './imagens_novas/zumbi01.png')
    obstaculo3  = new Obstaculo(3600, RUA_BASE - 25, 70, 95, './imagens_novas/obstaculo.png')
    obstaculo4  = new Obstaculo(4800, RUA_BASE - 25, 60, 85, './imagens_novas/obstaculo.png')
    vidaItem2   = new Coletavel(2200, RUA_BASE - 50, 45, 45)
    boostItem2  = new Boost(4600,    RUA_BASE - 50, 50, 50)
    boss2       = new Boss(7000,     RUA_BASE - 45, 120, 100)
}

// ==================== SONS ====================
let motor          = new Audio('./audio/soundtrack.mp3')
let somPersonagem  = new Audio('./audio/fase1/shadow.wav')
let somObstaculo   = new Audio('./audio/obstaculo.mp3')
let coletarSom     = new Audio('./audio/life_colectable.mp3')
let somBoost       = new Audio('./audio/boost.mp3')
let somBoss        = new Audio('./audio/boss.mp3')
let somGameOver    = new Audio('./audio/game_over_sound.mp3')
let musicaGameOver = new Audio('./audio/game_over_fundo_.mp3')

musicaGameOver.loop   = true
somGameOver.volume    = 1.0
musicaGameOver.volume = 0.5
motor.loop            = true
motor.volume          = 0.5
somPersonagem.volume  = 0.8
somObstaculo.volume   = 0.7
coletarSom.volume     = 0.9
somBoost.volume       = 0.9
somBoss.volume        = 1.0

// ==================== ESTADO GLOBAL ====================
let jogando          = true
let gameOverTocado   = false
let nivelDificuldade = 1
let shake1 = 0
let shake2 = 0
let dx     = 0
let dx2    = 0

// ==================== FUNDOS ====================
let imgFundo1       = new Image()
let imgFundo2       = new Image()
let fundo1Carregado = false
let fundo2Carregado = false

imgFundo1.onload  = () => { fundo1Carregado = true }
imgFundo1.onerror = () => { fundo1Carregado = false }
imgFundo1.src = './imagens_novas/fundo01.jpg'

imgFundo2.onload  = () => { fundo2Carregado = true }
imgFundo2.onerror = () => { fundo2Carregado = false }
imgFundo2.src = './imagens_novas/fundo02.jpg'

let fundoX  = 0
let fundoX2 = 0

// ==================== RESIZE ====================
function redimensionar() {
    canvas1.style.width  = window.innerWidth + 'px'
    canvas1.style.height = (MULTIPLAYER ? window.innerHeight / 2 : window.innerHeight) + 'px'
    if (MULTIPLAYER && canvas2) {
        canvas2.style.width  = window.innerWidth + 'px'
        canvas2.style.height = window.innerHeight / 2 + 'px'
    }
}
window.addEventListener('resize', redimensionar)
redimensionar()

// ==================== CONTROLES ====================
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault()

    if (jogando) motor.play()

    if (e.key === 'w' || e.key === 'ArrowUp')   personagem.pular()
    if (e.key === 'd' || e.key === 'ArrowRight') dx = 1

    if (MULTIPLAYER) {
        if (e.key === 'i' || e.key === 'I') personagem2.pular()
        if (e.key === 'l' || e.key === 'L') dx2 = 1
    }
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'd' || e.key === 'ArrowRight') dx = 0
    if (MULTIPLAYER && (e.key === 'l' || e.key === 'L')) dx2 = 0
})

// ==================== DIFICULDADE ====================
function atualizarDificuldade() {
    let pontos = MULTIPLAYER
        ? Math.max(personagem.pontos, personagem2.pontos)
        : personagem.pontos

    let novoNivel = Math.floor(pontos / 15) + 1
    if (novoNivel > nivelDificuldade) {
        nivelDificuldade = novoNivel

        inimigo1.vel   += 0.5
        obstaculo1.vel += 0.4
        obstaculo2.vel += 0.4
        boss.vel       += 0.8
        vidaItem.delaySpawn  -= 20
        boostItem.delaySpawn -= 20

        if (MULTIPLAYER) {
            inimigo2.vel   += 0.5
            obstaculo3.vel += 0.4
            obstaculo4.vel += 0.4
            boss2.vel      += 0.8
            vidaItem2.delaySpawn  -= 20
            boostItem2.delaySpawn -= 20
        }
    }
}

// ==================== COLISÕES J1 ====================
function verificarColisoes() {
    if (personagem.colisao(inimigo1)) {
        somPersonagem.play()
        personagem.vida--
        personagem.tomarDano()
        inimigo1.reiniciar()
        shake1 = 10
    }
    if (personagem.colisao(obstaculo1)) {
        somObstaculo.play()
        personagem.aplicarSlow()
        obstaculo1.reiniciar()
        shake1 = 3
    }
    if (personagem.colisao(obstaculo2)) {
        somObstaculo.play()
        personagem.aplicarSlow()
        obstaculo2.reiniciar()
        shake1 = 3
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
        shake1 = 20
    }
}

// ==================== COLISÕES J2 ====================
function verificarColisoes2() {
    if (!MULTIPLAYER) return

    if (personagem2.colisao(inimigo2)) {
        somPersonagem.play()
        personagem2.vida--
        personagem2.tomarDano()
        inimigo2.reiniciar()
        shake2 = 10
    }
    if (personagem2.colisao(obstaculo3)) {
        somObstaculo.play()
        personagem2.aplicarSlow()
        obstaculo3.reiniciar()
        shake2 = 3
    }
    if (personagem2.colisao(obstaculo4)) {
        somObstaculo.play()
        personagem2.aplicarSlow()
        obstaculo4.reiniciar()
        shake2 = 3
    }
    if (vidaItem2.ativo && personagem2.colisao(vidaItem2)) {
        coletarSom.play()
        personagem2.vida++
        vidaItem2.reiniciar()
    }
    if (boostItem2.ativo && personagem2.colisao(boostItem2)) {
        somBoost.play()
        personagem2.aplicarBoost()
        boostItem2.reiniciar()
    }
    if (boss2.ativo && personagem2.colisao(boss2)) {
        somBoss.play()
        personagem2.vida -= 3
        personagem2.tomarDano()
        boss2.reiniciar()
        shake2 = 20
    }
}

// ==================== PONTUAÇÃO ====================
function pontuar() {
    if (personagem.passou(inimigo1)) {
        personagem.pontos += 10
        inimigo1.reiniciar()
    }
    if (MULTIPLAYER && personagem2.passou(inimigo2)) {
        personagem2.pontos += 10
        inimigo2.reiniciar()
    }
}

// ==================== HELPER: DESENHAR FUNDO ====================
function desenharFundo(ctx, fundoXAtual, canvasH) {
    if (fundo1Carregado && fundo2Carregado) {
        let slots = [fundoXAtual, fundoXAtual + 1200, fundoXAtual + 2400]
        slots.forEach((x, i) => {
            let img = (i % 2 === 0) ? imgFundo1 : imgFundo2
            ctx.drawImage(img, x, 0, 1200, canvasH)
        })
    } else {
        ctx.fillStyle = '#2c3e50'
        ctx.fillRect(0, 0, 1200, canvasH)
        ctx.fillStyle = '#34495e'
        ctx.fillRect(0, RUA_TOPO, 1200, RUA_BASE - RUA_TOPO)
        ctx.fillStyle = '#f1c40f'
        for (let i = 0; i < 20; i++) {
            ctx.fillRect(i * 80, RUA_TOPO + ((RUA_BASE - RUA_TOPO) / 2), 40, 5)
        }
    }
}

// ==================== HELPER: DESENHAR HUD ====================
function desenharHUD(ctx, jogador, nivelD, canvasW, label) {
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(20, 20, 270, label ? 130 : 110)
    ctx.strokeStyle = '#39ff14'
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, 270, label ? 130 : 110)

    let offsetY = 0

    if (label) {
        ctx.fillStyle = '#39ff14'
        ctx.font = 'bold 12px Orbitron'
        ctx.shadowColor = '#39ff14'
        ctx.shadowBlur = 6
        ctx.fillText(label, 35, 38)
        offsetY = 20
    }

    ctx.fillStyle = '#ff3b3b'
    ctx.font = 'bold 20px Orbitron'
    ctx.shadowColor = '#ff3b3b'
    ctx.shadowBlur = 10
    ctx.fillText('VIDA: ' + jogador.vida, 40, 50 + offsetY)

    ctx.fillStyle = '#ffff00'
    ctx.shadowColor = '#ffff00'
    ctx.shadowBlur = 10
    ctx.fillText('PONTOS: ' + jogador.pontos, 40, 73 + offsetY)

    ctx.fillStyle = '#39ff14'
    ctx.shadowColor = '#39ff14'
    ctx.shadowBlur = 10
    ctx.fillText('NIVEL: ' + nivelD, 40, 96 + offsetY)

    ctx.shadowBlur = 0

    ctx.fillStyle = '#222'
    ctx.fillRect(40, 106 + offsetY, 200, 10)
    ctx.fillStyle = '#ff3b3b'
    ctx.fillRect(40, 106 + offsetY, Math.max(0, jogador.vida) * 40, 10)
    ctx.strokeStyle = '#39ff14'
    ctx.strokeRect(40, 106 + offsetY, 200, 10)

    if (jogador.boostTimer > 0) {
        ctx.fillStyle = 'cyan'
        ctx.font = '18px Arial'
        ctx.fillText('BOOST ATIVO!', canvasW / 2 - 50, 50)
    }
    if (jogador.slowTimer > 0) {
        ctx.fillStyle = 'orange'
        ctx.font = '18px Arial'
        ctx.fillText('SLOW ATIVO!', canvasW / 2 - 50, 50)
    }
}

// ==================== HELPER: GAME OVER ====================
function desenharGameOverCanvas(ctx, jogador, canvasW, canvasH, titulo) {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'
    ctx.fillRect(0, 0, canvasW, canvasH)

    ctx.strokeStyle = '#39ff14'
    ctx.lineWidth = 2
    ctx.strokeRect(30, 20, canvasW - 60, canvasH - 40)

    ctx.fillStyle = '#39ff14'
    ctx.font = 'bold ' + (MULTIPLAYER ? 36 : 60) + 'px Orbitron'
    ctx.textAlign = 'center'
    ctx.shadowColor = '#39ff14'
    ctx.shadowBlur = 20
    ctx.fillText(titulo || 'GAME OVER', canvasW / 2, canvasH * 0.38)

    ctx.shadowBlur = 0
    ctx.fillStyle = '#ffffff'
    ctx.font = (MULTIPLAYER ? 20 : 28) + 'px Rajdhani'
    ctx.fillText('PONTOS: ' + jogador.pontos, canvasW / 2, canvasH * 0.56)

    ctx.fillStyle = '#39ff14'
    ctx.font = (MULTIPLAYER ? 14 : 20) + 'px Rajdhani'
    ctx.fillText('PRESSIONE F5 PARA REINICIAR', canvasW / 2, canvasH * 0.72)
    ctx.fillText('ESC PARA VOLTAR AO MENU', canvasW / 2, canvasH * 0.85)

    ctx.strokeStyle = '#39ff14'
    ctx.beginPath()
    ctx.moveTo(canvasW / 2 - 120, canvasH * 0.44)
    ctx.lineTo(canvasW / 2 + 120, canvasH * 0.44)
    ctx.stroke()

    ctx.textAlign = 'left'
}

// ==================== DESENHAR J1 ====================
function desenharJ1() {
    var ctx  = ctx1
    var canW = canvas1.width
    var canH = canvas1.height

    if (shake1 > 0) {
        ctx.save()
        ctx.translate(Math.random() * 10 - 5, Math.random() * 10 - 5)
        shake1--
    }

    fundoX -= dx * personagem.velocidadeAtual
    if (fundoX <= -2400) fundoX = 0
    desenharFundo(ctx, fundoX, canH)

    if (personagem.vida > 0) {
        inimigo1.desenhar(ctx)
        obstaculo1.desenhar(ctx)
        obstaculo2.desenhar(ctx)
        if (vidaItem.ativo)  vidaItem.desenhar(ctx)
        if (boostItem.ativo) boostItem.desenhar(ctx)
        if (boss.ativo)      boss.desenhar(ctx)
        personagem.desenhar(ctx)
        desenharHUD(ctx, personagem, nivelDificuldade, canW, MULTIPLAYER ? 'JOGADOR 1  [ D/seta mover  |  W/seta pular ]' : null)
    } else {
        desenharGameOverCanvas(ctx, personagem, canW, canH, MULTIPLAYER ? 'J1 - GAME OVER' : 'GAME OVER')
    }

    if (shake1 > 0) ctx.restore()
}

// ==================== DESENHAR J2 ====================
function desenharJ2() {
    if (!MULTIPLAYER) return
    var ctx  = ctx2
    var canW = canvas2.width
    var canH = canvas2.height

    if (shake2 > 0) {
        ctx.save()
        ctx.translate(Math.random() * 10 - 5, Math.random() * 10 - 5)
        shake2--
    }

    fundoX2 -= dx2 * personagem2.velocidadeAtual
    if (fundoX2 <= -2400) fundoX2 = 0
    desenharFundo(ctx, fundoX2, canH)

    if (personagem2.vida > 0) {
        inimigo2.desenhar(ctx)
        obstaculo3.desenhar(ctx)
        obstaculo4.desenhar(ctx)
        if (vidaItem2.ativo)  vidaItem2.desenhar(ctx)
        if (boostItem2.ativo) boostItem2.desenhar(ctx)
        if (boss2.ativo)      boss2.desenhar(ctx)
        personagem2.desenhar(ctx)
        desenharHUD(ctx, personagem2, nivelDificuldade, canW, 'JOGADOR 2  [ L mover  |  I pular ]')
    } else {
        desenharGameOverCanvas(ctx, personagem2, canW, canH, 'J2 - GAME OVER')
    }

    if (shake2 > 0) ctx.restore()
}

// ==================== ATUALIZAR J1 ====================
function atualizarJ1() {
    if (personagem.vida <= 0) return

    personagem.mover(RUA_TOPO)
    personagem.animar()
    personagem.atualizarEstado()

    if (dx !== 0) {
        inimigo1.mover()
        obstaculo1.mover()
        obstaculo2.mover()
        vidaItem.mover()
        boostItem.mover()
        boss.mover()
    }

    inimigo1.animar()
    vidaItem.animar()
    boostItem.animar()
    boss.animar()

    verificarColisoes()
}

// ==================== ATUALIZAR J2 ====================
function atualizarJ2() {
    if (!MULTIPLAYER || personagem2.vida <= 0) return

    personagem2.mover(RUA_TOPO)
    personagem2.animar()
    personagem2.atualizarEstado()

    if (dx2 !== 0) {
        inimigo2.mover()
        obstaculo3.mover()
        obstaculo4.mover()
        vidaItem2.mover()
        boostItem2.mover()
        boss2.mover()
    }

    inimigo2.animar()
    vidaItem2.animar()
    boostItem2.animar()
    boss2.animar()

    verificarColisoes2()
}

// ==================== LOOP PRINCIPAL ====================
function main() {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
    if (MULTIPLAYER && ctx2) ctx2.clearRect(0, 0, canvas2.width, canvas2.height)

    desenharJ1()
    desenharJ2()

    if (jogando) {
        atualizarJ1()
        atualizarJ2()
        pontuar()
        atualizarDificuldade()

        var j1Morto = personagem.vida <= 0
        var j2Morto = !MULTIPLAYER || personagem2.vida <= 0

        if ((MULTIPLAYER ? (j1Morto && j2Morto) : j1Morto) && !gameOverTocado) {
            jogando = false
            motor.pause()
            somGameOver.play()
            musicaGameOver.play()
            gameOverTocado = true
        }
    }

    requestAnimationFrame(main)
}

// ==================== INIT ====================
// Script carregado dinamicamente: o evento 'load' já disparou.
// Chamamos main() diretamente.
console.log('Jogo iniciado — modo: ' + MODO)
main()

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.location.href = './index.html'
})