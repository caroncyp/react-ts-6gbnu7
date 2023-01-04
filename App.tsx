import React, { useState } from 'react';

function BlackjackStrategy() {
  const [playerCards, setPlayerCards] = useState(['2H', '8D']);
  const [dealerCard, setDealerCard] = useState('KH');
  const [numDecks, setNumDecks] = useState(6);
  const [playedCards, setPlayedCards] = useState([]);

  // Gestion des changements d'état lorsque les inputs sont modifiés
  const handlePlayerCardsChange = (event) => {
    setPlayerCards(event.target.value.split(', '));
  };
  const handleDealerCardChange = (event) => {
    setDealerCard(event.target.value);
  };
  const handleNumDecksChange = (event) => {
    setNumDecks(event.target.value);
  };

  // Calcul de la valeur de chaque main
  const playerTotal = getTotal(playerCards);
  const dealerTotal = getCardValue(dealerCard);

  let strategy;

  // Si vous avez blackjack (une main de 21 avec deux cartes), vous gagnez automatiquement
  if (playerTotal == 21) {
    strategy = 'Vous avez un blackjack !';
  } else {
    // Si vous avez moins de 17, vous devez tirer une carte
    if (playerTotal < 17) {
      strategy = 'Vous devez tirer une carte.';
    }
    // Si vous avez entre 17 et 21, vous devez vous arrêter
    else if (playerTotal < 21) {
      strategy = 'Vous devez vous arrêter.';
    }
    // Si vous avez plus de 21, vous êtes bust (c'est-à-dire que vous avez perdu)
    else {
      strategy = 'Vous êtes bust.';
    }
  }

  // Stratégies avancées :
  // Si vous avez un as et un 8, vous devez vous arrêter (soft 19)
  if (playerTotal == 19 && hasAce(playerCards)) {
    strategy = 'Vous devez vous arrêter (soft 19).';
  }
  // Si vous avez un as et un 9, vous devez vous arrêter (soft 20)
  if (playerTotal == 20 && hasAce(playerCards)) {
    strategy = 'Vous devez vous arrêter (soft 20).';
  }
  // Si vous avez un as et un 10, vous devez doubler (soft 21)
  if (playerTotal == 21 && hasAce(playerCards)) {
    strategy = 'Vous devez doubler (soft 21).';
  }
  // Si vous avez une main dure (sans as), vous devez suivre la stratégie de base en fonction de la main du croupier
  else {
    if (dealerTotal >= 7) {
      if (playerTotal >= 17) {
        strategy = 'Vous devez vous arrêter.';
      } else {
        strategy = 'Vous devez tirer une carte.';
      }
    } else {
      if (playerTotal >= 12) {
        strategy = 'Vous devez vous arrêter.';
      } else {
        strategy = 'Vous devez tirer une carte.';
      }
    }
  }

  // Si le nombre de decks utilisés est supérieur à 1, vous devez tenir compte des cartes déjà jouées pour déterminer votre stratégie
  if (numDecks > 1) {
    let remainingCards = 52 * numDecks - playedCards.length;
    let remainingHighCards = remainingCards / (52 - 16); // 16 cartes hautes dans un deck (as, roi, dame, valet, 10)
    let remainingAces = remainingCards / (52 - 4); // 4 as dans un deck

    // Si vous avez moins de 10 cartes hautes restantes par deck, vous devez être plus agressif en tirevant des cartes
    if (remainingHighCards < 10) {
      if (playerTotal < 17) {
        strategy =
          'Vous devez tirer une carte (peu de cartes hautes restantes).';
      }
    }
    // Si vous avez moins de 4 as restants par deck, vous devez être plus conservateur et vous arrêter plus souvent
    if (remainingAces < 4) {
      if (playerTotal >= 17) {
        strategy = "Vous devez vous arrêter (peu d'as restants).";
      }
    }
  }

  return (
    <div>
      <h1>Stratégie de Blackjack</h1>
      <label>
        Cartes du joueur :
        <input
          type="text"
          value={playerCards.join(', ')}
          onChange={handlePlayerCardsChange}
        />
      </label>
      <br />
      <label>
        Carte du croupier :
        <input
          type="text"
          value={dealerCard}
          onChange={handleDealerCardChange}
        />
      </label>
      <br />
      <label>
        Nombre de decks :
        <input type="number" value={numDecks} onChange={handleNumDecksChange} />
      </label>
      <br />
      <p>Votre main : {playerCards.join(', ')}</p>
      <p>Main du croupier : {dealerCard}</p>
      <p>{strategy}</p>
    </div>
  );
}
export default BlackjackStrategy;

// Cette fonction retourne la valeur totale d'une main de cartes
function getTotal(cards) {
  let total = 0;
  let numAces = 0;

  for (let card of cards) {
    let value = getCardValue(card);
    total += value;

    if (value == 1) {
      numAces++;
    }
  }

  // Si vous avez des as, ils valent 1 ou 11 selon ce qui est le plus avantageux pour vous
  for (let i = 0; i < numAces; i++) {
    if (total + 10 <= 21) {
      total += 10;
    }
  }

  return total;
}

// Cette fonction retourne la valeur d'une carte (2 à 10, 10 pour les figures, 1 pour l'as)
function getCardValue(card) {
  switch (card[0]) {
    case '2':
      return 2;
    case '3':
      return 3;
    case '4':
      return 4;
    case '5':
      return 5;
    case '6':
      return 6;
    case '7':
      return 7;
    case '8':
      return 8;
    case '9':
      return 9;
    case '1':
      return 10;
    case 'J':
      return 10;
    case 'Q':
      return 10;
    case 'K':
      return 10;
    case 'A':
      return 1;
    default:
      return 0;
  }
}

// Cette fonction retourne vrai si une main de cartes contient un as, faux sinon
function hasAce(cards) {
  for (let card of cards) {
    if (card[0] == 'A') {
      return true;
    }
  }
  return false;
}
