import React from 'react';
import GameModel from './models/GameModel';
import NewPlayerComponent from './components/NewPlayerComponent';
import NewGameComponent from './components/NewGameComponent';
import GameListComponent from './components/GameListComponent';
import PlayerMoveComponent from './components/PlayerMoveComponent';

class App extends React.Component {
  constructor() {
    super();

    this.games = new GameModel();
    this.games.subscribe(this.updateList.bind(this));

    this.state = {
      games: [],
      currentGame: null,
      currentPlayer: null,
      playerMove: ""
    };
  }

  updateList() {
    this.setState({
      games: this.games.resources
    });

    if (this.state.currentGame !== null) {
      let component = this;
      this.games.resources.map(function(game) {
        if (game._id === component.state.currentGame._id) {
          component.setState({
            currentGame: game
          });
          component.determineWinner();
        }
      });
    }
  }

  setPlayer(player) {
    this.setState({
      currentPlayer: player
    });
  }

  createGame() {
    this.games.addResource({
      playerOne: this.state.currentPlayer
    });
  }

  joinGame(game) {
    console.log("Joining game...");
    if (game.playerOne === this.state.currentPlayer || game.playerTwo === this.state.currentPlayer || game.playerTwo === null) {
      if (game.playerOne !== this.state.currentPlayer && game.playerTwo !== this.state.currentPlayer) {
        console.log("Joining game as player two...");
        this.games.save(game, { playerTwo: this.state.currentPlayer });
      }

      this.setState({
        currentGame: game
      });
    } else {
      window.alert("Can't touch this dung dung dung dung");
    }
  }

  containerStyles() {
    return {
      width: "500px",
      height: "500px",
      margin: "auto",
    };
  }

  headerStyle() {
    return {
      textAlign: "center"
    };
  }

  determineWinner() {
    let moveOne = this.state.currentGame.playerOneMove;
    let moveTwo = this.state.currentGame.playerTwoMove;
    if (moveOne !== null && moveTwo !== null) {
      if (moveOne === moveTwo) {
        this.storeWinner("draw");
      }

      if (moveOne === "Rock") {
        if (moveTwo === "Scissors") {
          this.storeWinner(this.state.currentGame.playerOne);
        }

        if (moveTwo === "Paper") {
          this.storeWinner(this.state.currentGame.playerTwo);
        }
      }

      if (moveOne === "Paper") {
        if (moveTwo === "Rock") {
          this.storeWinner(this.state.currentGame.playerOne);
        }

        if (moveTwo === "Scissors") {
          this.storeWinner(this.state.currentGame.playerTwo);
        }
      }

      if (moveOne === "Scissors") {
        if (moveTwo === "Rock") {
          this.storeWinner(this.state.currentGame.playerTwo);
        }

        if (moveTwo === "Paper") {
          this.storeWinner(this.state.currentGame.playerOne);
        }
      }
    }
  }

  storeWinner(winner) {
    this.games.save(this.state.currentGame, { winner: winner });
  }

  makeMove(move) {
    console.log(move);
    if (this.state.currentGame.playerOne === this.state.currentPlayer) {
      this.games.save(this.state.currentGame, { playerOneMove: move });
    }

    if (this.state.currentGame.playerTwo === this.state.currentPlayer) {
      this.games.save(this.state.currentGame, { playerTwoMove: move });
    }

    this.setState({
      playerMove: move
    });
  }

  render() {
    console.log(this.state);
    return (
      <div style={this.containerStyles()}>
        <h1 style={this.headerStyle()}>Rock Paper Scissors</h1>
        { this.state.currentPlayer !== null &&
          <p>Hi, {this.state.currentPlayer}</p> }

        { this.state.currentPlayer === null &&
          <NewPlayerComponent onCreate={this.setPlayer.bind(this)}/> }

        { this.state.currentGame === null &&
          <GameListComponent games={this.state.games} onSelect={this.joinGame.bind(this)}/> }

        { this.state.currentPlayer && this.state.currentGame === null &&
          <NewGameComponent onCreate={this.createGame.bind(this)}/> }

        { this.state.currentGame !== null &&
          <div className="game">
          <p>Player one: {this.state.currentGame.playerOne} ({this.state.currentGame.playerOneMove})</p>
          <p>Player two: {this.state.currentGame.playerTwo} ({this.state.currentGame.playerTwoMove})</p>

          { this.state.currentGame.winner === null && <div>
            <h2>{this.state.playerMove}</h2>
            <PlayerMoveComponent move="Rock" onClick={this.makeMove.bind(this)} />
            <PlayerMoveComponent move="Paper" onClick={this.makeMove.bind(this)} />
            <PlayerMoveComponent move="Scissors" onClick={this.makeMove.bind(this)} />
          </div> }

          { this.state.currentGame.winner !== null && <div>
            <h1>{this.state.currentGame.winner} won!</h1>
          </div> }
        </div>}
      </div>
    );
  }
}

export default App;
