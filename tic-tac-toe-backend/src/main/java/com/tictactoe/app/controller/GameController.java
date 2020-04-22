package com.tictactoe.app.controller;

import com.tictactoe.app.entity.GameTable;
import com.tictactoe.app.responses.CreateGameResponse;
import com.tictactoe.app.responses.SendNext;
import com.tictactoe.app.responses.StartGameResponse;
import com.tictactoe.app.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Optional;
import java.util.Random;

@RestController
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping(path = "/add")
        // Map ONLY POST Requests
        //    public @ResponseBody
    String addNewGame(@RequestParam Integer game_id
            , @RequestParam Integer user_id, @RequestParam String cur_state
            , @RequestParam Integer position) throws IOException {
        gameService.addNewGame(game_id, user_id, cur_state, position);
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
        gameService.addNewGame(game_id, user_id, cur_state, position);
        boolean nextPlayerResponse = gameService.findNextPlayer(game_id, cur_state, position);

        if (response == true && nextPlayerResponse == true ) {
            return "saved";
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }

//    @PostMapping(value = "/saveLastValue")
//    public @ResponseBody
//    String findNextPlayer(@RequestParam Integer game_id
//            , @RequestParam String lastValue, @RequestParam Integer lastPosition) throws IOException {
//        boolean response = gameService.findNextPlayer(game_id, lastValue, lastPosition);
//        if (response == true) {
//            return "saved";
//        } else {
//            throw new ResponseStatusException(
//                    HttpStatus.NOT_FOUND, "Game Not Found");
//        }
//    }

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
}


