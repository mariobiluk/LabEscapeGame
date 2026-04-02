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

    desenhar(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
        } else {
            ctx.fillStyle = '#ff0000'
            ctx.fillRect(this.x, this.y, this.w, this.h)
            ctx.fillStyle = 'white'
            ctx.font = '12px Arial'
            ctx.fillText('?', this.x + this.w / 2 - 5, this.y + this.h / 2 + 5)
        }
    }
}

// ==================== INIMIGO ANIMADO ====================
class InimigoAnimado extends Obj {
    constructor(x, y, w, h, tipo) {
        super(x, y, w, h, `./imagens_novas/zumbi01.png`)
        this.vel = 5
        this.ativo = true
        this.tipo = tipo
        this.frame = 1
        this.tempo = 0
        this.animacaoFrames = []

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

    desenhar(ctx) {
        if (!this.ativo) return

        let frameAtual = this.animacaoFrames[this.frame - 1]
        if (frameAtual && frameAtual.complete && frameAtual.naturalWidth > 0) {
            ctx.drawImage(frameAtual, this.x, this.y, this.w, this.h)
        } else {
            ctx.fillStyle = '#8B0000'
            ctx.fillRect(this.x, this.y, this.w, this.h)
            ctx.fillStyle = 'white'
            ctx.font = '12px Arial'
            ctx.fillText('Z', this.x + this.w / 2 - 5, this.y + this.h / 2 + 5)
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

    desenhar(ctx) {
        if (!this.ativo) return

        let frameAtual = this.animacaoFrames[this.frame - 1]
        if (frameAtual && frameAtual.complete && frameAtual.naturalWidth > 0) {
            ctx.drawImage(frameAtual, this.x, this.y, this.w, this.h)
        } else {
            ctx.fillStyle = '#800080'
            ctx.fillRect(this.x, this.y, this.w, this.h)
            ctx.fillStyle = 'white'
            ctx.font = '12px Arial'
            ctx.fillText('B', this.x + this.w / 2 - 5, this.y + this.h / 2 + 5)
        }
    }
}

// ==================== TEXTO ====================
class Text {
    desenhar(ctx, texto, x, y, cor, fonte) {
        ctx.fillStyle = cor
        ctx.font = fonte
        ctx.fillText(texto, x, y)
    }
}

// ==================== PERSONAGEM (Jogador 1) ====================
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

    gravidade = 0.4
    impulso = -12
    velY = 0
    noChao = false
    chaoY

    constructor(x, y, w, h, img) {
        super(x, y, w, h, img)
        this.chaoY = y
        this.animacaoFrames = []

        for (let i = 1; i <= 12; i++) {
            let imgAnim = new Image()
            imgAnim.src = `./imagens_novas/correndo0${i}.png`
            this.animacaoFrames.push(imgAnim)
        }
    }

    mover(RUA_TOPO) {
        this.velY += this.gravidade
        this.y += this.velY
    
        if (this.y >= this.chaoY) {
            this.y = this.chaoY
            this.velY = 0
            this.noChao = true
        } else {
            this.noChao = false
        }
    
        // REMOVA ou COMENTE este bloco que corta o pulo:
        // if (this.y < RUA_TOPO) {
        //     this.y = RUA_TOPO
        //     if (this.velY < 0) this.velY = 0
        // }
    }

    pular() {
        if (this.noChao) {
            this.velY = this.impulso
            this.noChao = false
        }
    }

    aplicarSlow() {
        if (this.boostTimer <= 0) {
            this.velocidadeAtual = 4
            this.slowTimer = 60
        }
    }

    aplicarBoost() {
        this.velocidadeAtual = 16
        this.boostTimer = 80
        if (this.slowTimer > 0) this.slowTimer = 0
    }

    tomarDano() {
        this.danoFlash = 10
    }

    atualizarEstado() {
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

    desenhar(ctx) {
        if (this.boostTimer > 0) {
            for (let i = 0; i < this.trail.length; i++) {
                let t = this.trail[i]
                ctx.globalAlpha = i / 10
                if (this.animacaoFrames[this.frame - 1] && this.animacaoFrames[this.frame - 1].complete) {
                    ctx.drawImage(this.animacaoFrames[this.frame - 1], t.x, t.y, this.w, this.h)
                } else {
                    ctx.fillStyle = `rgba(0, 200, 255, ${0.3 - i / 30})`
                    ctx.fillRect(t.x, t.y, this.w, this.h)
                }
            }
            ctx.globalAlpha = 1

            ctx.beginPath()
            ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 1.5, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(0,200,255,0.2)"
            ctx.fill()
        }

        if (this.danoFlash > 0) {
            ctx.globalAlpha = 0.5
        }

        if (this.animacaoFrames[this.frame - 1] && this.animacaoFrames[this.frame - 1].complete) {
            ctx.drawImage(this.animacaoFrames[this.frame - 1], this.x, this.y, this.w, this.h)
        } else {
            ctx.fillStyle = '#00ff00'
            ctx.fillRect(this.x, this.y, this.w, this.h)
        }

        ctx.globalAlpha = 1
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
    }
}

// ==================== PERSONAGEM 2 (Jogador 2 - Multiplayer) ====================
class Personagem2 extends Obj {

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

    gravidade = 0.4
    impulso = -12
    velY = 0
    noChao = false
    chaoY

    constructor(x, y, w, h) {
        super(x, y, w, h, './imagens_novas/personagem2_01.png')
        this.chaoY = y
        this.animacaoFrames = []

        // Personagem 2 usa imagens personagem2_01 até personagem2_07
        for (let i = 1; i <= 7; i++) {
            let imgAnim = new Image()
            imgAnim.src = `./imagens_novas/personagem2_0${i}.png`
            this.animacaoFrames.push(imgAnim)
        }
    }

    mover(RUA_TOPO) {
        this.velY += this.gravidade
        this.y += this.velY
    
        if (this.y >= this.chaoY) {
            this.y = this.chaoY
            this.velY = 0
            this.noChao = true
        } else {
            this.noChao = false
        }
    
        // REMOVA este bloco:
        // if (this.y < RUA_TOPO) {
        //     this.y = RUA_TOPO
        //     if (this.velY < 0) this.velY = 0
        // }
    }

    pular() {
        if (this.noChao) {
            this.velY = this.impulso
            this.noChao = false
        }
    }

    aplicarSlow() {
        if (this.boostTimer <= 0) {
            this.velocidadeAtual = 4
            this.slowTimer = 60
        }
    }

    aplicarBoost() {
        this.velocidadeAtual = 16
        this.boostTimer = 80
        if (this.slowTimer > 0) this.slowTimer = 0
    }

    tomarDano() {
        this.danoFlash = 10
    }

    atualizarEstado() {
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

    desenhar(ctx) {
        if (this.boostTimer > 0) {
            for (let i = 0; i < this.trail.length; i++) {
                let t = this.trail[i]
                ctx.globalAlpha = i / 10
                if (this.animacaoFrames[this.frame - 1] && this.animacaoFrames[this.frame - 1].complete) {
                    ctx.drawImage(this.animacaoFrames[this.frame - 1], t.x, t.y, this.w, this.h)
                } else {
                    ctx.fillStyle = `rgba(255, 150, 0, ${0.3 - i / 30})`
                    ctx.fillRect(t.x, t.y, this.w, this.h)
                }
            }
            ctx.globalAlpha = 1

            ctx.beginPath()
            ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 1.5, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(255,150,0,0.2)"
            ctx.fill()
        }

        if (this.danoFlash > 0) {
            ctx.globalAlpha = 0.5
        }

        if (this.animacaoFrames[this.frame - 1] && this.animacaoFrames[this.frame - 1].complete) {
            ctx.drawImage(this.animacaoFrames[this.frame - 1], this.x, this.y, this.w, this.h)
        } else {
            ctx.fillStyle = '#ff8800'
            ctx.fillRect(this.x, this.y, this.w, this.h)
        }

        ctx.globalAlpha = 1
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

        // Personagem 2 tem 7 frames de animação
        if (this.frame > 7) this.frame = 1
    }
}