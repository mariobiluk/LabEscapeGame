🎮 ZONA CONTAMINADA

👤 Identificação do Projeto

Título do Projeto: Zona Contaminada
Desenvolvedor: Mario Teodoro de Mello Biluk
Curso: Técnico em Desenvolvimento de Sistemas (SENAI)
Ano: 2026

🧠 Visão Geral do Sistema
📌 Descrição

O Zona Contaminada é um jogo de corrida 2D desenvolvido em JavaScript (ES6+) utilizando a Canvas API, no qual o jogador controla um personagem que deve sobreviver em um ambiente hostil repleto de inimigos, obstáculos e elementos interativos.

🎯 Objetivo

Criar uma experiência dinâmica de jogo baseada em reflexos e tomada de decisão, onde o jogador precisa desviar de perigos, coletar itens e sobreviver o máximo possível.

☣️ Tema

O jogo se passa em uma estação espacial contaminada por resíduos radioativos, onde criaturas foram transformadas em zumbis.
O jogador precisa escapar enquanto enfrenta:

Zumbis
Carros desgovernados
Obstáculos radioativos
Um boss final

🎮 Instruções de Jogabilidade

Tecla	Ação
W / ↑	Pular
D / →	Avançar
ESC	Voltar ao menu

🧪 Itens Coletáveis

Vida (vida.png) → aumenta a vida do jogador
Boost (boost.png) → aumenta velocidade temporariamente
Obstáculos → reduzem velocidade (efeito slow)

⚙️ Especificações Técnicas
🧩 Mecânicas implementadas

Sistema de gravidade e pulo
Sistema de colisão com margem (hitbox ajustada)
Sistema de vida
Sistema de pontuação
Sistema de efeitos (boost, slow, dano visual)
Sistema de animação por sprites
Sistema de spawn dinâmico
Boss com múltiplos frames

📈 Progressão de Dificuldade (RN01)

A dificuldade aumenta automaticamente com base nos pontos:

let novoNivel = Math.floor(personagem.pontos / 15) + 1

E afeta:

Velocidade dos inimigos
Velocidade do boss
Frequência de itens

🌆 Troca de Cenário (RN02)

O jogo utiliza dois backgrounds alternados, criando sensação de progressão visual contínua.

❤️ Sistema de Vidas (RF02)

Jogador inicia com 5 vidas
Perde vida ao colidir com inimigos
Pode recuperar com coletáveis

🏆 Pontuação (RF03)

+10 pontos ao ultrapassar inimigos
Base para progressão de dificuldade

🎁 Coletáveis (RF04)

Implementados:

Vida (recuperação)
Boost (vantagem temporária)

🧠 Interface (RF05)

O sistema possui:

Menu inicial
Tela de jogo
Tela "Sobre"
Tela de Game Over

📖 Tela Sobre (RF06)

Contém:

Nome do desenvolvedor
Informações profissionais
Link de projeto externo

🏁 Condição de Vitória (RN03)

⚠️ Observação:
O jogo atualmente possui sistema de sobrevivência infinita (endless runner), não possui ainda 3 fases com vitória final implementada.

📘 Manual (RN04)

Implementado na tela Sobre, contendo:

Controles
Explicação de itens
Objetivo do jogo
🧱 Arquitetura Orientada a Objetos
🔷 Classe Base
class Obj

Responsável por:

Posição
Dimensão
Renderização
🔶 Classes Derivadas
Personagem
InimigoAnimado
Obstaculo
Coletavel
Boost
Boss

✔ Aplicação de:

Herança
Encapsulamento
Reutilização de código

🔁 Diagrama de Classes (Resumo)
Obj
 ├── Personagem
 ├── InimigoAnimado
 ├── Obstaculo
 ├── Coletavel
 ├── Boost
 └── Boss

🔄 Diagrama de Sequência (Colisão)
Personagem colide com inimigo
Função colisao() retorna true
Sistema executa:
Redução de vida
Efeito visual
Reset do inimigo

📋 Requisitos do Projeto
✔️ Requisitos Funcionais

Código	Implementação
RF01	Movimento com física e controle
RF02	Sistema de vidas
RF03	Pontuação dinâmica
RF04	Coletáveis implementados
RF05	Telas completas
RF06	Tela sobre implementada

✔️ Regras de Negócio

Código	Status
RN01	✔️ Implementado
RN02	✔️ Implementado
RN03	⚠️ Parcial
RN04	✔️ Implementado

✔️ Requisitos Não Funcionais

Código	Implementação
RNF01	JavaScript ES6
RNF02	Executa no navegador
RNF03	Layout adaptado para tela cheia
RNF04	Loop com requestAnimationFrame

🧾 Créditos
Desenvolvedor: Mario Biluk
Product Owner (Professor): Carlos Roberto da Silva Filho

🌐 Link de Produção

game-lab-escape-hbxf.vercel.app

💻 Instalação e Execução

1. Clonar o repositório
git clone https://github.com/mariobiluk/LabEscapeGame
2. Instalar dependências

❌ Não necessário (projeto puro em JS)

3. Executar o projeto

Abra o arquivo:

index.html

Ou utilize um servidor local:

Live Server (VS Code)

4. Rodar versão online

game-lab-escape-hbxf.vercel.app
🚀 Considerações Finais

O projeto demonstra:

Domínio de Programação Orientada a Objetos
Uso de Canvas API
Implementação de sistemas de jogo reais
Organização de código modular

Além disso, apresenta potencial para evolução com:

Sistema de fases reais
Menu de vitória
Melhor IA de inimigos
Sistema de áudio mais complexo