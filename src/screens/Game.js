// Global Imports
import React, { useState, useEffect, useRef } from 'react';

// Component Imports
import Footer from '../components/Footer';

// Style Imports
import '../styles/Globals.module.css';
import ScreenStyles from '../styles/Players.module.css';
import GameStyles from '../styles/Game.module.css';

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [shufflerIndex, setShufflerIndex] = useState(0);
  const [isScoreVisible, setIsScoreVisible] = useState(false);
  const shufflerRef = useRef(null);

  // Use Effect call to retrieve players
  useEffect(() => {
    const data = window.localStorage.getItem('players');
    setPlayers(JSON.parse(data));
  }, []);

  // Function to start a new game
  const startNewGame = () => {
    const isNewGame = window.confirm('¿Seguro que deseas comenzar un nuevo partido? Perderás la información guardada hasta el momento.');

    if(isNewGame) {
      window.localStorage.removeItem('players');
      window.location.href = '/';
    }
  }

  // Function to add points
  const addPoints = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    
    setPlayers(prev => prev.map(selectedPlayer => {
      if(selectedPlayer.name === name) {
        return {
          name: selectedPlayer.name,
          points: parseInt(selectedPlayer.points) + parseInt(value)
        }
      }

      return selectedPlayer;
    }));
  }

  // Function to save the data to localStorage
  const updatePlayers = (e) => {
    e.preventDefault();

    window.localStorage.setItem('players', JSON.stringify(players));
    e.target.reset();
    setIsScoreVisible(false);

    // To determine who shuffled and who should be next
    const previousShuffler = parseInt(shufflerRef.current.dataset.index);

    // If the index matches an existing user, we set the shuffler to be that player
    const shuffler = players.filter((player, index) => index === previousShuffler + 1);
    if(shuffler.length === 1) {
      setShufflerIndex(previousShuffler + 1);
    } else {
      // If not, we set it to the first player again
      setShufflerIndex(0);
    };

    // Then we check the score
    checkScore();
  }

  // Function to reduce score by ten
  const reducePointsByTen = (e) => {
    e.preventDefault();
    
    const previousElement = e.target.previousElementSibling;
    // Simulate focus and blur events to trigger the change
    previousElement.focus();
    previousElement.value = -10;
    previousElement.blur();
  }

  // Function to check if the score reached 100
  const checkScore = () => {

    // Check if any of the players reached 100 points
    players.map((player) => {
      if(player.points >= 100) {
        // If so, we check how many players are currently in the game
        if(players.length > 2) {
          // If we have more than 2, we delete the player that lost, and carry on
          const isPlayerEliminated = window.confirm(`El jugador ${player.name} ha perdido! Seguir jugando?`)

          if(isPlayerEliminated) {
            removePlayer(player);
          } else {
            // If they didn't want to keep playing
            window.localStorage.removeItem('players');
            window.location.href = '/';
          }
        } else {
          // If we only have 2, show an alert and trigger a new game
          const isGameFinished = window.confirm(`El jugador ${player.name} ha perdido! Jugar la revancha?`)
          
          if(isGameFinished) {
            // Reset points
            setPlayers(prev => prev.map(selectedPlayer => {
              return {
                name: selectedPlayer.name,
                points: 0
              }
            }));
          } else {
            // If they didn't want to play a new game
            window.localStorage.removeItem('players');
            window.location.href = '/';
          }
        }
      }
      return players;
    });
  }

  // Function to delete a player
  const removePlayer = (deletedPlayer) => {
    const filteredArray = players.filter(player => player !== deletedPlayer);
    setPlayers(filteredArray);
  }

  // Function to run when someone does chinchon
  const setWinner = (e) => {
    e.preventDefault();

    // Get the winner
    const winner = e.target.dataset.player;
    const isGameFinished = window.confirm(`El jugador ${winner} ha ganado! Jugar la revancha?`);

    if(isGameFinished) {
      // Reset points
      setPlayers(prev => prev.map(selectedPlayer => {
        return {
          name: selectedPlayer.name,
          points: 0
        }
      }));
      
      setIsScoreVisible(false);
    } else {
      // If they didn't want to play a new game
      window.localStorage.removeItem('players');
      window.location.href = '/';
    }
  }

  return (
    <React.Fragment>
      <section className={ScreenStyles.Container}>
      <div className={ScreenStyles.TitleContainer}>
          <span className={ScreenStyles.Icon1}>🂡</span>
          <span className={ScreenStyles.Icon2}>🂱</span>
          <span className={ScreenStyles.Icon3}>🃑</span>
          <span className={ScreenStyles.Icon4}>🃁</span>
          <h1 className={ScreenStyles.Title}>
            Podrida
          </h1>
          <span className={ScreenStyles.Subtitle}>contador</span>
        </div>
        <div className={ScreenStyles.PlayersContainer}>
          <h2>Puntaje:</h2>
          <ul>
            {players && players.map((player, key) => <li key={key}>
                <h3>{player.name}</h3>
                {shufflerIndex === key && <h4 ref={shufflerRef} data-index={key}>Baraja</h4>}
                <p>{player.points} Puntos</p>
              </li>
            )}
          </ul>
        </div>
        {isScoreVisible &&
          <div className={`${GameStyles.ModalWindow}`} data-container="modal">
            <div className={`${ScreenStyles.FormContainer} ${GameStyles.FormContainer}`}>
              <div className={GameStyles.ModalTitleContainer}>
                <h3 className={ScreenStyles.Subtitle}>Anotar Puntos</h3>
                <button onClick={() => setIsScoreVisible(false)} className={GameStyles.CloseModalButton}>X</button>
              </div>
              <form onSubmit={updatePlayers}>
                {players.map((player, key) =>
                  <fieldset key={key}>
                    <label htmlFor={player.name}>¿Cu&aacute;ntos puntos sum&oacute; {player.name}?</label>
                    <input type="number" name={player.name} onBlur={addPoints} defaultValue="0" />
                    <button onClick={reducePointsByTen} data-player={player.name} className={GameStyles.Secondary}>⭐ -10</button>
                    <button onClick={setWinner} data-player={player.name} className={GameStyles.Primary}>💯 Chinch&oacute;n</button>
                  </fieldset>
                )}
                <input type="submit" value="Anotar" />
              </form>
            </div>
          </div>
        }
        <div className={GameStyles.ActionsContainer}>
          <button onClick={() => setIsScoreVisible(true)} className={GameStyles.AddScoreButton}>Anotar Puntos</button>
          <button onClick={startNewGame} className={GameStyles.NewGameButton}>Nuevo Juego</button>
        </div>
      </section>
      <Footer />
    </React.Fragment>
  );
};

export default Game;