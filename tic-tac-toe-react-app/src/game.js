import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Board from './board.js';
import './index.css';

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board game_id={this.props.game_id} user_id={this.props.user_id} next={this.props.next} player1={this.props.player1} player2={this.props.player2}  user_name={this.props.user_name} user_name1={this.props.user_name1} user_name2={this.props.user_name2} />
                </div>
            </div>
        );
    }
}

export default Game; 