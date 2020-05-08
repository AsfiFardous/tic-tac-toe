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
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'

class Square extends React.Component {

    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>
                <span style={{ 'color': this.props.value === 'X' ? 'blue' : 'black' }}>{this.props.value}</span>
            </button>
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
            user_id: this.props.user_id,
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
                body: 'game_id=' + this.props.game_id + '&winner=' + winner + '&status='
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

        }

        else {
            let addPromise = fetch("/add", {
                method: 'post',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: 'cur_state=' + squares[i] + '&position=' + i + '&game_id=' + this.props.game_id + '&user_id=' + this.props.user_id + '&next=' + this.props.user_name

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
            let whoNextPromise = fetch("/whoNext?game_id=" + this.props.game_id);
            whoNextPromise.then((response) => response.json())
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
            status = 'Draw';
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
            <div>
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
            </div>
        );
    };
}
class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board game_id={this.props.game_id} user_id={this.props.user_id} next={this.props.next} player1={this.props.player1} player2={this.props.player2} user_name1={this.props.user_name1} user_name2={this.props.user_name2} />
                </div>
            </div>
        );
    }
}


class Page extends React.Component {
    constructor(props) {
        super(props);
        const urlParams = new URLSearchParams(window.location.search);
        this.state = {
            page: 1,
            user_id: null,
            user_name: null,
            user_name1: null,
            user_name2: null,
            game_id: urlParams.get('gameid') || '',
            value: null,
            player1: null,
            player2: null,
            next: null,
            // title: ''
        };
    }

    waitForGaneStart(gameId) {
        let repeatedRequest = setInterval(() => {
            let creatIsStartProimse = fetch("/start-response?game_id=" + gameId);
            creatIsStartProimse.then((response) => response.json())
                .then(jsonResponse => {
                    console.log(jsonResponse);
                    if (jsonResponse.status === 'Started') {
                        clearInterval(repeatedRequest);
                        this.setState({
                            page: 2,
                            game_id: jsonResponse.gameId,
                            user_id: jsonResponse.firstPlayer,
                            // user_name:jsonResponse.firstUsername,
                            next: jsonResponse.firstPlayer,
                            player1: jsonResponse.firstPlayer,
                            player2: jsonResponse.secondPlayer,
                            user_name1: jsonResponse.username1,
                            user_name2: jsonResponse.username2
                        });
                    }
                })
                .catch(function (error) {
                    // alert('Cloud not start game');
                    console.log(error);
                });
        }, 2000);

    }




    handleClickFriend() {
        if (this.state.user_name != null) {
            let value = this.state.game_id;
            if (!this.state.game_id) {
                value = -1;
            }
            let createGamePromise = fetch("/play-game-with-friend?username=" + this.state.user_name + "&gameId=" + value);

            createGamePromise.then((response) => response.json())
                .then(jsonResponse => {
                    console.log(jsonResponse);
                    if (jsonResponse.status === 'WaitingForFriend') {
                        this.setState({
                            page: 4,
                            game_id: jsonResponse.gameId,
                            user_id: jsonResponse.userId,
                            player1: jsonResponse.userId,
                            user_name1: jsonResponse.username1,
                            user_name2: jsonResponse.username2
                        });
                        this.waitForGaneStart(jsonResponse.gameId);
                    }

                    else if (jsonResponse.status === 'Started') {
                        this.setState({
                            page: 2,
                            game_id: jsonResponse.gameId,
                            // player1: jsonResponse.firstPlayer,
                            user_id: jsonResponse.userId,
                            //next: jsonResponse.firstPlayer,
                            //user_name: jsonResponse.secondUsername,
                            user_name1: jsonResponse.username1,
                            user_name2: jsonResponse.username2,
                            player2: jsonResponse.userId,
                        });
                    }
                    else {
                        alert('Game not found');
                    }
                })
                .catch(function (error) {
                    alert('Cloud not start game');
                    console.log(error);
                });
        }
        else {
            alert('Please enter username');
        }

    }

    handleClickAnonymous() {
        if (this.state.user_name !== null) {

            let createGamePromise = fetch("/create-game?username=" + this.state.user_name);
            createGamePromise.then((response) => response.json())
                .then(jsonResponse => {
                    console.log(jsonResponse);
                    if (jsonResponse.status != 'Started') {
                        this.setState({
                            page: 3,
                            game_id: jsonResponse.gameId,
                            user_id: jsonResponse.userId,
                            player1: jsonResponse.userId,
                            user_name1: jsonResponse.username1,
                            user_name2: jsonResponse.username2
                        });
                        this.waitForGaneStart(jsonResponse.gameId);
                    }
                    else {
                        this.setState({
                            page: 2,
                            game_id: jsonResponse.gameId,
                            user_id: jsonResponse.userId,
                            user_name1: jsonResponse.username1,
                            user_name2: jsonResponse.username2,
                            player2: jsonResponse.userId,
                        });
                    }
                })
                .catch(function (error) {
                    alert('Cloud not start game');
                    console.log(error);
                });
        }
        else {
            alert('Please enter username');
        }

    }

    handleChange(event) {
        this.setState({ user_name: event.target.value })
    }
    handleGameIdChange(event) {
        this.setState({ game_id: event.target.value })
    }

    handleCopyLink(event) {
        var copyTextarea = document.querySelector('.js-copytextarea');
        copyTextarea.focus();
        copyTextarea.select();

        try {
            var successful = document.execCommand('copy');
            // var msg = successful ? 'successful' : 'unsuccessful';
            alert('Copied');
        } catch (err) {
            alert('Oops, unable to copy');
        }
    }

    render() {
        if (this.state.page === 1) {
            return (
                <Container>
                    <div className="play">
                        <Row>
                            <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
                                <h1 className="flex-center">
                                    <Badge pill variant="success">
                                        TIC TAC TOE
                                        </Badge>{' '}
                                </h1>
                                <div className="flex-center">
                                    <Image src="/tic_tac_toe.gif" rounded />
                                </div>
                                <div className="flex-center">
                                    <Form.Control style={{ marginTop: '1em' }} size="lg" type="text" placeholder="Your name" value={this.state.user_name} onChange={this.handleChange.bind(this)} />
                                </div>
                                <div className="flex-center control-button">
                                    {!this.state.game_id && <Button variant="primary" style={{ marginTop: '1em' }} size="lg" onClick={this.handleClickAnonymous.bind(this)}>Play with anonymous</Button>}
                                </div>
                                <div className="flex-center control-button">
                                    <Button variant="primary" style={{ width: '210px' }} size="lg" onClick={this.handleClickFriend.bind(this)}>{this.state.game_id ? 'Join Game' : 'Play with friend'}</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>

                </Container >

            );
        }
        else if (this.state.page === 2) {
            return (
                <Container>
                    <div className="play">
                        <Row>
                            <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
                                <h1 className="flex-center">
                                    <Badge pill variant="success">
                                        TIC TAC TOE
                                        </Badge>{' '}
                                </h1>
                                <div className="flex-center" style={{ marginTop: '1em' }}>
                                    <Game game_id={this.state.game_id} user_id={this.state.user_id} next={this.state.next} player1={this.state.player1} player2={this.state.player2} user_name1={this.state.user_name1} user_name2={this.state.user_name2} />
                                </div>
                            </Col>
                        </Row>
                    </div>

                </Container>

            );
        }
        else if (this.state.page === 3) {
            return (
                <Container>
                    <div className="play">
                        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
                            <h1 className="flex-center">
                                <Badge pill variant="success">
                                    TIC TAC TOE
                                        </Badge>{' '}
                            </h1>
                            <div className="flex-center">
                                <Image src="/tic_tac_toe.gif" rounded />

                            </div>
                            <div className="flex-center">
                                <h3 style={{ color: 'blue', marginTop: '1em' }}>Waiting for second player</h3>
                            </div>


                        </Col>
                    </div>
                </Container>
            )
        }

        else if (this.state.page === 4) {
            let shareLink = window.location.href + '?gameid=' + this.state.game_id;
            return (
                <Container>
                    <div className="play">
                        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
                            <h1 className="flex-center">
                                <Badge pill variant="success">
                                    TIC TAC TOE
                                        </Badge>{' '}
                            </h1>
                            <div className="flex-center">
                                <Image src="/tic_tac_toe.gif" rounded />
                            </div>
                            <div className="flex-center">
                                <h3 style={{ color: 'blue', marginTop: '1em' }}>{'Share this link: '}</h3>
                            </div>
                            <div className="flex-center">
                                <p>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            value={shareLink}
                                            className="js-copytextarea"
                                        />
                                        <InputGroup.Append>
                                            <Button variant="outline-secondary" onClick={this.handleCopyLink.bind(this)} >Copy Link</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </p>
                            </div>

                        </Col>
                    </div>
                </Container>
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
