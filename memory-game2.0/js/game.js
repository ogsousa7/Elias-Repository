const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');

const characters = [
    'goku',
    'vegeta',
    'android',
    'bills',
    'broly',
    'bulma',
    'freeza',
    'gohan',
    'kuririn',
    'whis',
];

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

let firstCard = '';
let secondCard = '';

// --- LÓGICA DO RANKING ---

const saveRanking = (name, time) => {
    // Busca o ranking atual ou cria um array vazio se não existir
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    
    // Adiciona a nova pontuação
    ranking.push({ name, time: parseInt(time) });
    
    // Ordena por tempo (menor para o maior) e mantém apenas os top 5
    ranking.sort((a, b) => a.time - b.time);
    const top5 = ranking.slice(0, 5);
    
    localStorage.setItem('ranking', JSON.stringify(top5));
    return top5;
}

const showRanking = (top5) => {
    const list = document.getElementById('ranking-list');
    list.innerHTML = top5
        .map((player, index) => `<li>${index + 1}º ${player.name} - ${player.time}s</li>`)
        .join('');
}

// --- LÓGICA DO JOGO ---

const checkEndGame = () => {
    const disabledCards = document.querySelectorAll('.disable-card');

    if (disabledCards.length === 20) {
        clearInterval(this.loop);
        
        const playerName = spanPlayer.innerHTML;
        const finalTime = timer.innerHTML;
        
        // Salva no LocalStorage e gera a lista para o HTML
        const top5 = saveRanking(playerName, finalTime);
        showRanking(top5);

        // Preenche o texto do modal e o exibe
        const modal = document.querySelector('.modal');
        document.getElementById('final-result').innerHTML = `Mandou bem, ${playerName}! Seu tempo foi de ${finalTime} segundos.`;
        modal.classList.add('show-modal');
    }
}

const checkCards = () => {
    const firstCharacter = firstCard.getAttribute('data-character');
    const secondCharacter = secondCard.getAttribute('data-character');

    if (firstCharacter === secondCharacter) {
        firstCard.firstChild.classList.add('disable-card');
        secondCard.firstChild.classList.add('disable-card');

        firstCard = '';
        secondCard = '';

        checkEndGame();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('reveal-card');
            secondCard.classList.remove('reveal-card');

            firstCard = '';
            secondCard = '';
        }, 500);
    }
}

const revealCard = ({ target }) => {
    if (target.parentNode.className.includes('reveal-card')) {
        return;
    }

    if (firstCard === '') {
        target.parentNode.classList.add('reveal-card');
        firstCard = target.parentNode;
    } else if (secondCard === '') {
        target.parentNode.classList.add('reveal-card');
        secondCard = target.parentNode;

        checkCards();
    }
}

const createCard = (character) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');

    front.style.backgroundImage = `url('../imagens-jogo-memoria/${character}.png')`;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', revealCard);
    card.setAttribute('data-character', character);

    return card;
}

const loadGame = () => {
    const duplicateCharacters = [...characters, ...characters];
    const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

    shuffledArray.forEach((character) => {
        const card = createCard(character);
        grid.appendChild(card);
    });
}

const startTimer = () => {
    this.loop = setInterval(() => {
        const currentTime = Number(timer.innerHTML);
        timer.innerHTML = currentTime + 1;
    }, 1000);
}

window.onload = () => {
    spanPlayer.innerHTML = localStorage.getItem('player');
    startTimer();
    loadGame();
}