// ==================== CLASSE BASE ====================
class Obj {
    constructor(x, y, w, h, img) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.img = new Image()
        this.img.onerror = () => {
            console.error(`ERRO: Não foi possível carregar a imagem: ${img}`)
        }
        this.img.src = img
    }

    desenhar() {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            des.drawImage(this.img, this.x, this.y, this.w, this.h)
        } else {
            // Fallback - desenha um retângulo colorido
            des.fillStyle = '#ff0000'
            des.fillRect(this.x, this.y, this.w, this.h)
            des.fillStyle = 'white'
            des.font = '12px Arial'
            des.fillText('?', this.x + this.w / 2 - 5, this.y + this.h / 2 + 5)
        }
    }
}

// ==================== INIMIGO ANIMADO ====================
// ==================== INIMIGO ANIMADO ====================
class InimigoAnimado extends Obj {
    constructor(x, y, w, h, tipo) {
        super(x, y, w, h, `./imagens_novas/zumbi01.png`)  // imagem base (fallback)
        this.vel = 5
        this.ativo = true
        this.tipo = tipo
        this.frame = 1
        this.tempo = 0

        this.animacaoFrames = []

        // Pré-carregar todas as animações
        for (let i = 1; i <= 6; i++) {
            let imgAnim = new Image()
            imgAnim.src = `./imagens_novas/zumbi0${i}.png`
            this.animacaoFrames.push(imgAnim)
        }
    }

    mover() {
        this.x -= this.vel
        if (this.x < -200) this.reiniciar()
    }

    reiniciar() {
        this.x = 1500 + Math.random() * 500
    }

    animar() {
        this.tempo++
        if (this.tempo > 8) {
            this.tempo = 0
            this.frame++
        }
        if (this.frame > 6) this.frame = 1
    }

    desenhar() {
        if (!this.ativo) return

        let frameAtual = this.animacaoFrames[this.frame - 1]
        if (frameAtual && frameAtual.complete && frameAtual.naturalWidth > 0) {
            des.drawImage(frameAtual, this.x, this.y, this.w, this.h)
        } else {
            // Fallback enquanto as imagens carregam
            des.fillStyle = '#8B0000'
            des.fillRect(this.x, this.y, this.w, this.h)
            des.fillStyle = 'white'
            des.font = '12px Arial'
            des.fillText('Z', this.x + this.w / 2 - 5, this.y + this.h / 2 + 5)
        }
    }
}

// ==================== OBSTÁCULO ====================
class Obstaculo extends Obj {
    constructor(x, y, w, h, img) {
        super(x, y, w, h, img)
        this.vel = 4
        this.ativo = true
    }

    mover() {
        this.x -= this.vel
        if (this.x < -100) this.reiniciar()
    }

    reiniciar() {
        this.x = 2000 + Math.random() * 500
    }
}

// ==================== COLETÁVEL (Vida) ====================
class Coletavel extends Obj {
    constructor(x, y, w, h) {
        super(x, y, w, h, './imagens_novas/vida.png')
        this.vel = 3
        this.ativo = true
        this.delaySpawn = 0
        this.tempoSpawn = 0
        this.contador = 0
        this.baseY = y
    }

    mover() {
        if (this.ativo) {
            this.x -= this.vel
            if (this.x < -100) this.reiniciar()
        }

        // Sistema de respawn
        if (!this.ativo) {
            this.contador++
            if (this.contador > this.delaySpawn + 100) {
                this.reiniciar()
            }
        }
    }

    reiniciar() {
        this.x = 1800 + Math.random() * 400
        this.ativo = true
        this.contador = 0
        this.baseY = this.y
    }

    animar() {
        if (this.ativo) {
            this.y = this.baseY + Math.sin(Date.now() * 0.005) * 8
        }
    }
}

// ==================== BOOST ====================
class Boost extends Obj {
    constructor(x, y, w, h) {
        super(x, y, w, h, './imagens_novas/boost.png')
        this.vel = 3
        this.ativo = true
        this.delaySpawn = 0
        this.tempoSpawn = 0
        this.contador = 0
        this.baseY = y
    }

    mover() {
        if (this.ativo) {
            this.x -= this.vel
            if (this.x < -100) this.reiniciar()
        }

        // Sistema de respawn
        if (!this.ativo) {
            this.contador++
            if (this.contador > this.delaySpawn + 100) {
                this.reiniciar()
            }
        }
    }

    reiniciar() {
        this.x = 1800 + Math.random() * 400
        this.ativo = true
        this.contador = 0
        this.baseY = this.y
    }

    animar() {
        if (this.ativo) {
            this.y = this.baseY + Math.sin(Date.now() * 0.005) * 8
        }
    }
}

// ==================== BOSS ====================
// ==================== BOSS ====================
class Boss extends Obj {
    constructor(x, y, w, h) {
        super(x, y, w, h, './imagens_novas/boss01.png')
        this.vel = 3
        this.ativo = true
        this.vida = 10
        this.frame = 1
        this.tempo = 0
        this.animacaoFrames = []

        for (let i = 1; i <= 8; i++) {
            let imgAnim = new Image()
            imgAnim.src = `./imagens_novas/boss0${i}.png`
            this.animacaoFrames.push(imgAnim)
        }
    }

    mover() {
        if (this.ativo) {
            this.x -= this.vel
            if (this.x < -300) this.reiniciar()
        }
    }

    reiniciar() {
        this.x = 2200 + Math.random() * 800
        this.ativo = true
    }

    animar() {
        this.tempo++
        if (this.tempo > 8) {
            this.tempo = 0
            this.frame++
        }
        if (this.frame > 8) this.frame = 1
    }

    desenhar() {
        if (!this.ativo) return

        let frameAtual = this.animacaoFrames[this.frame - 1]
        if (frameAtual && frameAtual.complete && frameAtual.naturalWidth > 0) {
            des.drawImage(frameAtual, this.x, this.y, this.w, this.h)
        } else {
            des.fillStyle = '#800080'
            des.fillRect(this.x, this.y, this.w, this.h)
            des.fillStyle = 'white'
            des.font = '12px Arial'
            des.fillText('B', this.x + this.w / 2 - 5, this.y + this.h / 2 + 5)
        }
    }
}

// ==================== TEXTO ====================
class Text {
    desenhar(texto, x, y, cor, fonte) {
        des.fillStyle = cor
        des.font = fonte
        des.fillText(texto, x, y)
    }
}

// ==================== PERSONAGEM ====================
class Personagem extends Obj {

    dir = 0
    velocidadeBase = 10
    velocidadeAtual = 10

    vida = 5
    pontos = 0

    frame = 1
    tempo = 0

    slowTimer = 0
    boostTimer = 0

    trail = []
    danoFlash = 0

    // Gravidade
    gravidade = 0.5
    impulso = -12
    velY = 0
    noChao = false
    chaoY

    constructor(x, y, w, h, img) {
        super(x, y, w, h, img)
        this.chaoY = y
        this.animacaoFrames = []

        // Pré-carregar todas as animações
        for (let i = 1; i <= 12; i++) {
            let imgAnim = new Image()
            imgAnim.src = `./imagens_novas/correndo0${i}.png`
            this.animacaoFrames.push(imgAnim)
        }
    }

    mover() {
        // Gravidade
        this.velY += this.gravidade
        this.y += this.velY

        if (this.y >= this.chaoY) {
            this.y = this.chaoY
            this.velY = 0
            this.noChao = true
        } else {
            this.noChao = false
        }

        // Limite superior
        // Limite superior — era hardcoded 200, agora respeita RUA_TOPO
        if (this.y < RUA_TOPO) {
            this.y = RUA_TOPO
            if (this.velY < 0) this.velY = 0
        }
    }

    pular() {
        if (this.noChao) {
            this.velY = this.impulso
            this.noChao = false
        }
    }

    aplicarSlow() {
        if (this.boostTimer <= 0) { // Não aplica slow se estiver com boost
            this.velocidadeAtual = 4
            this.slowTimer = 60
        }
    }

    aplicarBoost() {
        this.velocidadeAtual = 16
        this.boostTimer = 80
        if (this.slowTimer > 0) this.slowTimer = 0 // Remove slow se tiver
    }

    tomarDano() {
        this.danoFlash = 10
    }

    atualizarEstado() {
        // Trail effect
        this.trail.push({ x: this.x, y: this.y })
        if (this.trail.length > 10) this.trail.shift()

        if (this.danoFlash > 0) this.danoFlash--

        if (this.slowTimer > 0) {
            this.slowTimer--
            if (this.slowTimer === 0 && this.boostTimer <= 0) {
                this.velocidadeAtual = this.velocidadeBase
            }
            return
        }

        if (this.boostTimer > 0) {
            this.boostTimer--
            if (this.boostTimer === 0 && this.slowTimer <= 0) {
                this.velocidadeAtual = this.velocidadeBase
            }
            return
        }

        this.velocidadeAtual = this.velocidadeBase
    }

    desenhar() {
        // Trail effect quando em boost
        if (this.boostTimer > 0) {
            for (let i = 0; i < this.trail.length; i++) {
                let t = this.trail[i]
                des.globalAlpha = i / 10
                if (this.animacaoFrames[this.frame - 1] && this.animacaoFrames[this.frame - 1].complete) {
                    des.drawImage(this.animacaoFrames[this.frame - 1], t.x, t.y, this.w, this.h)
                } else {
                    des.fillStyle = `rgba(0, 200, 255, ${0.3 - i / 30})`
                    des.fillRect(t.x, t.y, this.w, this.h)
                }
            }
            des.globalAlpha = 1

            // Efeito de brilho
            des.beginPath()
            des.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 1.5, 0, Math.PI * 2)
            des.fillStyle = "rgba(0,200,255,0.2)"
            des.fill()
        }

        if (this.danoFlash > 0) {
            des.globalAlpha = 0.5
        }

        // Desenhar personagem
        if (this.animacaoFrames[this.frame - 1] && this.animacaoFrames[this.frame - 1].complete) {
            des.drawImage(this.animacaoFrames[this.frame - 1], this.x, this.y, this.w, this.h)
        } else {
            // Fallback
            des.fillStyle = '#00ff00'
            des.fillRect(this.x, this.y, this.w, this.h)
        }

        des.globalAlpha = 1
    }

    colisao(obj) {
        let margem = 30

        return (
            this.x + margem < obj.x + obj.w &&
            this.x + this.w - margem > obj.x &&
            this.y + margem < obj.y + obj.h &&
            this.y + this.h - margem > obj.y
        )
    }

    passou(obj) {
        return obj.x <= -100
    }

    animar() {
        this.tempo++

        if (!this.noChao) {
            this.frame = 1
            return
        }

        if (this.tempo > 8) {
            this.tempo = 0
            this.frame++
        }

        if (this.frame > 5) this.frame = 1

        // Não precisa recarregar a imagem, já temos os frames pré-carregados
    }
}