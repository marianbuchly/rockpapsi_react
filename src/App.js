import React from 'react';
import Gamemodel from './Models/Gamemodel'

class App extends React.Component {
  constructor(){
    super();

    this.state = {
      games: []
    };
  }

  componentDidMount(){
    this.games = new GameModel();
    this.games.subscribe(this.updateList.bind(this));
  }


updateList(){
  this.setState({
    games:this.games.resources
  });
}

  containerStyles(){
    return {
      width: "500px",
      height: "500px",
      margin: "auto"
    };
  }

  headerStyle(){
    return {
        textAlign: "center"
    };

  }
    render() {
        return (
            <div style={this.containerStyles()}>
              <h1>Rock Paper Siccors</h1>
              </div>
        );
    }
}

export default App;
