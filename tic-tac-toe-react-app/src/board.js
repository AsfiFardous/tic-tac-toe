import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { bool } from 'prop-types';
import Square from './square.js';
import './index.css';

// function add(a,b){
//     return a+b;
// }

// add = (a,b) => {
//     return a+b;
// }


class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            next: this.props.next,
            nextValue: 'X',
            game_id: this.props.game_id,
            user_id: this.props.user_id,
            username: this.props.username,
            player1: this.props.player1,
            player2: this.props.player2,
            user_name1: this.props.user_name1,
            user_name2: this.props.user_name2,
            isFinished: false
        };
        if (this.state.user_id === this.state.player2) {
            this.waitForNextPlayer();
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        if (this.props.user_id !== this.state.next || squares[i] || this.state.isFinished) {
            return;
        }
        squares[i] = this.state.nextValue;

        if (this.state.next == this.state.player1) {
            this.setState({
                squares: squares,
                next: this.state.player2,
                nextValue: 'O',

            });
        }
        else {
            this.setState({
                squares: squares,
                next: this.state.player1,
                nextValue: 'X',

            });
        }

        let winner = calculateWinner(squares);
        let draw = isDraw(squares);

        if (winner || draw) {
            let gamestate = winner ? 'Finished' : 'Draw';
            let addUpdatePromise = fetch("/game-status", {
                method: 'post',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: 'game_id=' + this.state.game_id + '&winner=' + winner + '&status='
                    + gamestate + '&cur_state=' + squares[i] + '&position=' + i + '&user_id=' + this.props.user_id
                    + '&next=' + this.props.user_name
            })
            this.setState({
                isFinished: true
            });
            addUpdatePromise.then((response) => {
                console.log(response);
            })
                .catch(function (error) {
                    console.log(error);
                });
            this.waitForPlayAgain();
        }

        else {
            let addPromise = fetch("/add", {
                method: 'post',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: 'cur_state=' + squares[i] + '&position=' + i + '&game_id=' + this.state.game_id + '&user_id=' + this.props.user_id + '&next=' + this.props.user_name

            });

            addPromise.then((response) => {
                console.log(response);
            })
                .catch(function (error) {
                    console.log(error);
                });

            this.waitForNextPlayer();
        }
    }


    waitForNextPlayer() {
        let repeatRequest = setInterval(() => {
            let whoNextPromise = fetch("/whoNext?game_id=" + this.state.game_id);
            whoNextPromise.then(function(abcd) {return abcd.json()})
                .then(jsonResponse => {
                    console.log(jsonResponse);
                    // if(this.state.isFinished){
                    //     clearInterval(repeatRequest);
                    // }
                    if (jsonResponse.status === 'Finished' || jsonResponse.status === 'Draw') {
                        clearInterval(repeatRequest);
                        const squares = this.state.squares.slice();
                        squares[jsonResponse.position] = jsonResponse.lastValue;
                        this.setState({
                            squares: squares,
                            isFinished: true
                        });
                        this.waitForPlayAgain();
                    }
                    else {
                        if (jsonResponse.next == this.props.user_id) {
                            clearInterval(repeatRequest);
                            const squares = this.state.squares.slice();
                            squares[jsonResponse.position] = jsonResponse.lastValue;
                            if (jsonResponse.lastValue == 'X') {
                                this.setState({
                                    squares: squares,
                                    next: jsonResponse.next,
                                    nextValue: 'O',

                                });
                            }
                            else {
                                this.setState({
                                    squares: squares,
                                    next: jsonResponse.next,
                                    nextValue: 'X',

                                });
                            }
                        }
                        else {
                            this.setState({ next: jsonResponse.next });

                        }
                    }
                })
                .catch(function (error) {
                    // alert('Cloud not start game');
                    console.log(error);
                });
        }, 2000);
    }


    waitForPlayAgain() {
        let repeatRequest = setInterval(() => {
            let playAgain = fetch("/check-for-play-again?gameId=" + this.state.game_id + "&userId=" + this.state.user_id);
            playAgain.then((response) => response.text()).then(gameStatus=> {
                // let gameStatus =response.text();
                    console.log(gameStatus);

                    if (this.state.user_id == this.state.player1 && gameStatus === 'First player wants to play again') {
                        clearInterval(repeatRequest);
                        this.checkResponseToMyRequest();
                    }
                    else if (this.state.user_id == this.state.player1 && gameStatus === 'Second player wants to play again') {
                        clearInterval(repeatRequest);
                        this.sendMyResponse();
                    }
                    else if (this.state.user_id == this.state.player2 && gameStatus === 'Second player wants to play again') {
                        clearInterval(repeatRequest);
                        this.checkResponseToMyRequest();

                    }
                    else if (this.state.user_id == this.state.player2 && gameStatus === 'First player wants to play again') {
                        clearInterval(repeatRequest);
                        this.sendMyResponse();
                    }

                })
                .catch(function (error) {
                    // alert('Cloud not start game');
                    console.log(error);
                });
        }, 2000);
    }


    handlePlayAgain() {
        let playAgainPromise = fetch("/play-again-request", {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: 'gameId=' + this.state.game_id + '&userId=' + this.state.user_id
        });

        playAgainPromise.then((response) => {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            });

    }

    sendMyResponse() {
        let myResponse = window.confirm("Want to play again?");
        if (myResponse == true) {
                // this.requsetNewGameId();
                this.creatGameAgain();
            }
            else {
                window.location = window.location.href;
                let addPromise = fetch("/my-response-to-play-again-request", {
                        method: 'post',
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        body: 'myResponse=' + myResponse + '&gameId=' + this.state.game_id
            
                    });
            
                    addPromise.then((response) => {
                        console.log(response);
                    })
                        .catch(function (error) {
                            console.log(error);
                        });
            }
    }

        // let addPromise = fetch("/my-response-to-play-again-request", {
        //     method: 'post',
        //     headers: {
        //         "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        //     },
        //     body: 'myResponse=' + myResponse + '&gameId=' + this.state.game_id

        // });

        // addPromise.then((response) => {
        //     console.log(response);
        // })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        // if (myResponse == true) {
        //     this.requsetNewGameId();
        // }
        // else {
        //     window.location = window.location.href;
        // }


  

    creatGameAgain() {
        let createGamePromise;
        if (this.state.user_id === this.state.player1) {
            createGamePromise = fetch("/create-game-again?gameId=" + this.state.game_id + "&player1=" + this.state.player2 + "&username1=" + this.state.user_name2 + "&player2=" + this.state.user_id + "&username2=" + this.state.user_name1);
           
        }
        else if (this.state.user_id === this.state.player2) {
            createGamePromise = fetch("/create-game-again?gameId=" + this.state.game_id + "&player1=" + this.state.player1 + "&username1=" + this.state.user_name1 + "&player2=" + this.state.user_id + "&username2=" + this.state.user_name2);
        }
        createGamePromise.then((response) => response.json())
            .then(jsonResponse => {
                console.log(jsonResponse);

                this.setState({
                    squares: Array(9).fill(null),
                    game_id: jsonResponse.gameId,
                    // user_id: this.state.user_id,
                    // username: this.state.username,
                    // next: jsonResponse.next,
                    // nextValue: 'O',
                    // player1: jsonResponse.firstPlayer,
                    // player2: jsonResponse.secondPlayer,
                    // user_name1: jsonResponse.username1,
                    // user_name2: jsonResponse.username2,
                    isFinished: false

                });
                 this.waitForNextPlayer(jsonResponse.gameId);


            })
            .catch(function (error) {
                alert('Cloud not start game');
                console.log(error);
            });
    }



    requestNewGameId() {
        let requestNewGameId = fetch("/get-new-gameId?gameId=" + this.state.game_id + "&userId=" + this.state.user_id);
        requestNewGameId.then((response) => response.json())
            .then(jsonResponse => {
                console.log(jsonResponse);

                this.setState({
                    squares: Array(9).fill(null),
                    game_id: jsonResponse.gameId,
                    // user_id: this.state.user_id,
                    // username: this.state.username,
                    next: jsonResponse.next,
                    nextValue: 'X',
                    player1: jsonResponse.firstPlayer,
                    player2: jsonResponse.secondPlayer,
                    user_name1: jsonResponse.username1,
                    user_name2: jsonResponse.username2,
                    isFinished: false

                });

            })
            .catch(function (error) {
                alert('Cloud not start game');
                console.log(error);
            });
    }

    checkResponseToMyRequest() {
        let repeatRequest = setInterval(() => {
            let checkResponse = fetch("/check-response-to-play-again-request?gameId=" + this.state.game_id);
            checkResponse.then((response) => response.text()).then(gameStatus=> {
                // let gameStatus =response.text();
                    console.log(gameStatus);
                    if (gameStatus == 'Yes') {
                        clearInterval(repeatRequest);
                         this.requestNewGameId() ;
                        // set state
                    }
                    else if (gameStatus == 'No') {
                        clearInterval(repeatRequest);
                        window.location = window.location.href;

                    }

                })
                .catch(function (error) {
                    // alert('Cloud not start game');
                    console.log(error);
                });
        }, 2000);
    }



    renderSquare(i) {
        return <Square
            value={this.state.squares[i]
            }
            onClick={() => this.handleClick(i)}
        />;
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner == 'X') {
            status = <div className="status">Winner:  <span style={{ color: 'blue' }} >{this.state.user_name1}</span></div>
        }
        else if (winner == 'O') {
            status = <div className="status">Winner:  <span style={{ color: 'blue' }} >{this.state.user_name2}</span></div>
        }
        else if (isDraw(this.state.squares)) {
            status = <div className="status" style={{ color: 'blue' }}>Draw</div>
        }
        else {
            if (this.state.nextValue == 'X') {
                status = <div className="status">Next player:  <span style={{ color: 'blue' }} >{this.state.user_name1}</span></div>
            }
            else {
                status = <div className="status">Next player:  <span style={{ color: 'blue' }} >{this.state.user_name2}</span></div>
            }
        }

        return (
            <div className="play">
                {status}
                {/* <div className="status">{status}</div> */}
                <table>
                    <tbody>
                        <tr className="row-separator">
                            <td className="col-separator">{this.renderSquare(0)}</td>
                            <td className="col-separator">{this.renderSquare(1)}</td>
                            <td>{this.renderSquare(2)}</td>
                        </tr>
                        <tr className="row-separator">
                            <td className="col-separator">{this.renderSquare(3)}</td>
                            <td className="col-separator">{this.renderSquare(4)}</td>
                            <td>{this.renderSquare(5)}</td>
                        </tr>
                        <tr>
                            <td className="col-separator">{this.renderSquare(6)}</td>
                            <td className="col-separator">{this.renderSquare(7)}</td>
                            <td>{this.renderSquare(8)}</td>
                        </tr>
                    </tbody>
                </table>

                {(this.state.isFinished) && <Button variant="primary" style={{ width: '210px', marginTop: '1em' }} size="lg" onClick={this.handlePlayAgain.bind(this)}>Play Again</Button>}
            </div>
        );
    };
}
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function isDraw(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] == null) {
            return false;
        }
    }
    return true;
}

export default Board; 