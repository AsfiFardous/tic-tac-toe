package com.tictactoe.app.controller;

import com.tictactoe.app.responses.CreateGameResponse;
import com.tictactoe.app.responses.PlayAgainGameResponse;
import com.tictactoe.app.responses.SendNext;
import com.tictactoe.app.responses.StartGameResponse;
import com.tictactoe.app.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@RestController
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping(path = "/add")
        // Map ONLY POST Requests
        //    public @ResponseBody
    String addNewMove(@RequestParam Integer game_id
            , @RequestParam Integer user_id, @RequestParam String cur_state
            , @RequestParam Integer position) throws IOException {
        gameService.addNewMove(game_id, user_id, cur_state, position);
        boolean response = gameService.findNextPlayer(game_id, cur_state, position);
        if(response== true) {
            return "Saved";
        }
        else{
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }


    @PostMapping(path = "/game-status")
    String addGameStatus(@RequestParam Integer game_id, @RequestParam String winner
            , @RequestParam String status, @RequestParam Integer user_id, @RequestParam String cur_state
            , @RequestParam Integer position ) throws IOException {
        boolean response = gameService.addGameStatus(game_id, winner, status);
       // gameService.addNewGame(game_id, user_id, cur_state, position);
        boolean nextPlayerResponse = gameService.findNextPlayer(game_id, cur_state, position);

        if (response == true && nextPlayerResponse == true ) {
            return "saved";
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }

    @RequestMapping(value = "/whoNext")
    public @ResponseBody
    SendNext whoIsNext(@RequestParam Integer game_id) throws IOException {
        SendNext v = gameService.whoIsNext(game_id);
        if (v != null) {
            return v;
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }

    }

    @RequestMapping(value = "/start-response")
    public @ResponseBody
    StartGameResponse isStartResponse(@RequestParam Integer game_id) throws IOException {
        StartGameResponse currentStatus = gameService.isStartResponse(game_id);
        if (currentStatus != null) {
            return currentStatus;
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }


    @RequestMapping(value = "/create-game")
    public @ResponseBody
    CreateGameResponse createGame(@RequestParam String username) {
        CreateGameResponse crGameResponse = gameService.createGame(username);
        if (crGameResponse != null) {
            return crGameResponse;
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }

    @RequestMapping(value = "/play-game-with-friend")
    public @ResponseBody
    CreateGameResponse playGameWithFriend(@RequestParam String username,@RequestParam Integer gameId) {
        CreateGameResponse playGameResponse = gameService.playGameWithFriend(username,gameId);
        if  (playGameResponse != null) {
            return playGameResponse;
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }

    @PostMapping(value = "/play-again-request")
    String playGameAgain( @RequestParam Integer gameId,@RequestParam Integer userId) {
        boolean playAgainResponse = gameService.playGameAgain(gameId, userId);
        if (playAgainResponse == true) {
            return "saved";
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }


    @RequestMapping(value = "/check-for-play-again")
    public @ResponseBody
    String checkForPlayAgainRequest(@RequestParam Integer gameId, @RequestParam Integer userId ) {
        String playGameResponse = gameService.checkForPlayAgainRequest(gameId,userId);
        if  (playGameResponse != null) {
            return playGameResponse;
        } else {
            return "No request for new game found";
        }
    }
    @PostMapping(value = "/my-response-to-play-again-request")
    String myResponseToPlayAgainRequest(@RequestParam String myResponse, @RequestParam Integer gameId ) {

        boolean response = gameService.myResponseToPlayAgainRequest(myResponse,gameId);
        if(response== true) {
            return "Saved";
        }
        else{
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }

    @RequestMapping(value = "/check-response-to-play-again-request")
    public @ResponseBody
    String checkResponseToPlayAgainRequest(@RequestParam Integer gameId) {
        String playGameResponse = gameService.checkResponseToPlayAgainRequest(gameId);
        if  (playGameResponse != null) {
            return playGameResponse;
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }

    @RequestMapping(value = "/create-game-again")
    public @ResponseBody
    PlayAgainGameResponse createGameAgain(@RequestParam Integer gameId,@RequestParam Integer player1,@RequestParam String username1, @RequestParam Integer player2, @RequestParam String username2) {
        PlayAgainGameResponse playGameResponse = gameService. createGameAgain(gameId, player1, username1, player2, username2);
        if  (playGameResponse != null) {
            return playGameResponse;
        }
        else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }


    @RequestMapping(value = "/get-new-gameId")
    public @ResponseBody
    PlayAgainGameResponse getNewGameId(@RequestParam Integer gameId,@RequestParam Integer userId) {
        PlayAgainGameResponse playGameResponse = gameService. getNewGameId(gameId, userId);
        if  (playGameResponse != null) {
            return playGameResponse;
        }
        else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }

}


