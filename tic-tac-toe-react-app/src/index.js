import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { WSAEINVALIDPROVIDER } from 'constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { bool } from 'prop-types';



class Square extends React.Component {

    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>{this.props.value}</button>
        )
    };
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            
            next: this.props.next,
            nextValue: 'X',
            player1: this.props.player1,
            player2: this.props.player2,
            // getNext: null,
            // setNext: null,
            isFinished: false
        };
        if (props.user_id === props.player2) {
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
            let gamestate = draw ? 'Draw' : 'Finished';
            let addUpdatePromise = fetch("/game-status", {
                method: 'post',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: 'game_id=' + this.props.game_id + '&winner=' + winner + '&status=' + gamestate
            })
            this.setState({
                isFinished: true
            });
        }


        let addPromise = fetch("/add", {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: 'cur_state=' + squares[i] + '&position=' + i + '&game_id=' + this.props.game_id + '&user_id=' + this.props.user_id

        });

        addPromise.then((response) => {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            });

        let sendCurrentMove = fetch("/saveLastValue", {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: 'game_id=' + this.props.game_id + '&next=' + this.props.user_id + '&lastValue=' + squares[i] + '&lastPosition=' + i

        });
        sendCurrentMove.then((response) => {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            });

        this.waitForNextPlayer();


    }

    waitForNextPlayer() {
        let repeatRequest = setInterval(() => {
            let whoNextPromise = fetch("/whoNext?game_id=" + this.props.game_id);
            whoNextPromise.then((response) => response.json())
                .then(jsonResponse => {
                    console.log(jsonResponse);
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
        if (winner) {
            status = 'Winner: ' + winner;
        }
        else if (isDraw(this.state.squares)) {
            status = 'Draw';
        }
        else {
            status = 'Next player: ' + (this.state.next);
            
           
        }

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    };
}
class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board game_id={this.props.game_id} user_id={this.props.user_id} next={this.props.next} player1={this.props.player1} player2={this.props.player2} />
                </div>
            </div>
        );
    }
}


class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            user_id: null,
            game_id: null,
            value: null,
            next: null
        };
    }

    waitForGaneStart(gameId) {
        let repeatedRequest = setInterval(() => {
            let creatIsStartProimse = fetch("/start-response?game_id=" + gameId);
            creatIsStartProimse.then((response) => response.json())
                .then(jsonResponse => {
                    console.log(jsonResponse);
                    if (jsonResponse.status == 'Started') {
                        clearInterval(repeatedRequest);
                        this.setState({
                            page: 2,
                            game_id: jsonResponse.gameId,
                            user_id: jsonResponse.userId,
                            next: jsonResponse.userId,
                            player1: jsonResponse.userId

                        });
                    }
                })
                .catch(function (error) {
                    // alert('Cloud not start game');
                    console.log(error);
                });
        }, 2000);

    }

    handleClick() {

        let createGamePromise = fetch("/create-game");
        createGamePromise.then((response) => response.json())
            .then(jsonResponse => {
                console.log(jsonResponse);
                if (jsonResponse.status != 'Started') {
                    this.setState({
                        page: 3,
                        game_id: jsonResponse.gameId,
                        user_id: jsonResponse.userId,


                    });
                    this.waitForGaneStart(jsonResponse.gameId);
                }
                else {
                    this.setState({
                        page: 2,
                        game_id: jsonResponse.gameId,
                        user_id: jsonResponse.userId,
                        player2: jsonResponse.userId
                    });
                }
            })
            .catch(function (error) {
                alert('Cloud not start game');
                console.log(error);
            });

    }

    render() {
        if (this.state.page === 1) {
            return (
                <Container>
                    <div className="play">
                        <Row>
                            <Col md={{ span: 4, offset: 4 }}>
                                <Button variant="primary" onClick={this.handleClick.bind(this)}>Play</Button>
                            </Col>
                        </Row>
                    </div>

                </Container>

            );
        }
        else if (this.state.page === 2) {
            return (
                <Container>
                    <div className="play">
                        <Row>
                            <Col md={{ span: 4, offset: 4 }}>
                                <Game game_id={this.state.game_id} user_id={this.state.user_id} next={this.state.next} player1={this.state.player1} player2={this.state.player2} />
                            </Col>
                        </Row>
                    </div>

                </Container>

            );
        }
        else if (this.state.page === 3) {
            return (
                <container>
                    <div className="play">
                        <Col md={{ span: 4, offset: 4 }}>
                            <p>Waiting for second player</p>
                        </Col>
                    </div>
                </container>
            )
        }
    }
}

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);

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
