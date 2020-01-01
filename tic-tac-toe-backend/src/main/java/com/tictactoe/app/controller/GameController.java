package com.tictactoe.app.controller;

import com.tictactoe.app.entity.GameTable;
import com.tictactoe.app.entity.MoveTable;
import com.tictactoe.app.repository.GameTableRepository;
import com.tictactoe.app.repository.MoveTableRepository;
import com.tictactoe.app.responses.CreateGameResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.Random;

@RestController
public class GameController {
    @Autowired
    private MoveTableRepository moveTableRepository;
    @Autowired
    private GameTableRepository gameTableRepository;

    @PostMapping(path = "/add") // Map ONLY POST Requests
    public @ResponseBody
    String addNewGame(@RequestParam Integer game_id
            , @RequestParam Integer user_id, @RequestParam String cur_state
            , @RequestParam Integer position) {

        MoveTable n = new MoveTable();
        n.setGame_id(game_id);
        n.setUser_id(user_id);
        n.setCur_state(cur_state);
        n.setPosition(position);
        moveTableRepository.save(n);
        return "Saved";
    }

    @PostMapping(path = "/game-status") // Map ONLY POST Requests
    public @ResponseBody
    String addGameStatus(@RequestParam Integer game_id, @RequestParam String winner
            , @RequestParam String status) {

        Optional<GameTable> gameDataOptional = gameTableRepository.findById(game_id);

        if (gameDataOptional.isPresent()) {
            GameTable gameData = gameDataOptional.get();
            gameData.setGameId(game_id);
            gameData.setWinner(winner);
            gameData.setStatus(status);
            gameTableRepository.save(gameData);

            return "Saved";

        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }


    @Transactional
    @RequestMapping(value = "/create-game")
    public @ResponseBody
    CreateGameResponse createGame() {
        Random rand = new Random();

        int userId = rand.nextInt(1000);

        int updateCount = gameTableRepository.pairUser(userId);

        if (updateCount == 0) { //first player
            GameTable m = new GameTable();
            m.setFirstPlayer(userId);
            m.setStatus("Waiting");
            GameTable insertedGame = gameTableRepository.save(m);
            return new CreateGameResponse(insertedGame.getGameId(), insertedGame.getFirstPlayer());
        }else{ //second player
           GameTable pairedGame =  gameTableRepository.findGameTableBySecondPlayer(userId);
            return new CreateGameResponse(pairedGame.getGameId(), pairedGame.getSecondPlayer());

        }

       // int game_id = rand.nextInt(1000);

        }

    }


