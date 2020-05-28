import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { bool } from 'prop-types';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Game from './game.js';
import './index.css';

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

    waitForGameStart(gameId) {
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
                        this.waitForGameStart(jsonResponse.gameId);
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
                            player1: jsonResponse.opponent,
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
                        this.waitForGameStart(jsonResponse.gameId);
                    }
                    else {
                        this.setState({
                            page: 2,
                            game_id: jsonResponse.gameId,
                            user_id: jsonResponse.userId,
                            user_name1: jsonResponse.username1,
                            user_name2: jsonResponse.username2,
                            player1: jsonResponse.opponent,
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
            // var msg = successful ? q'successful' : 'unsuccessful';
            alert('Copied');
        } catch (err) {
            alert('Oops, unable to copy');
        }
    }

    render() {
        if (this.state.page === 1) {
            return (
                <Container>
                    <div >
                        <Row>
                        
                            <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="flex-center">
                                <h1>
                                    <Badge pill variant="success">
                                        TIC TAC TOE
                                        </Badge>{' '}
                                </h1>
                                <div>
                                    <Image src="/tic_tac_toe.gif" rounded />
                                </div>
                                <div>
                                    <Form.Control style={{ marginTop: '1em' }} size="lg" type="text" placeholder="Your name" value={this.state.user_name} onChange={this.handleChange.bind(this)} />
                                </div>
                                <div className="control-button">
                                    {!this.state.game_id && <Button variant="primary" style={{ marginTop: '1em' }} size="lg" onClick={this.handleClickAnonymous.bind(this)}>Play with anonymous</Button>}
                                </div>
                                <div className="control-button">
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
                    <div >
                        <Row>
                            <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}  className="flex-center">
                                <h1>
                                    <Badge pill variant="success">
                                        TIC TAC TOE
                                        </Badge>{' '}
                                </h1>
                                <div style={{ marginTop: '1em' }}>
                                    <Game game_id={this.state.game_id} user_id={this.state.user_id} next={this.state.next} player1={this.state.player1} player2={this.state.player2}  user_name={this.state.user_name} user_name1={this.state.user_name1} user_name2={this.state.user_name2} />
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
                    <div >
                        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="flex-center">
                            <h1>
                                <Badge pill variant="success">
                                    TIC TAC TOE
                                        </Badge>{' '}
                            </h1>
                            <div >
                                <Image src="/tic_tac_toe.gif" rounded />

                            </div>
                            <div>
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
                    <div >
                        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="flex-center">
                            <h1 >
                                <Badge pill variant="success">
                                    TIC TAC TOE
                                        </Badge>{' '}
                            </h1>
                            <div>
                                <Image src="/tic_tac_toe.gif" rounded />
                            </div>
                            <div >
                                <h3 style={{ color: 'blue', marginTop: '1em' }}>{'Share this link: '}</h3>
                            </div>
                            <div >
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

export default Page; 