package com.tictactoe.app.controller;

import com.tictactoe.app.entity.GameTable;
import com.tictactoe.app.entity.MoveTable;
import com.tictactoe.app.repository.GameTableRepository;
import com.tictactoe.app.repository.MoveTableRepository;
import com.tictactoe.app.responses.CreateGameResponse;
import com.tictactoe.app.responses.FindNextPlayerId;
import com.tictactoe.app.responses.SendNext;
import com.tictactoe.app.responses.SendPlayerValue;
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
        n.setUser_id(user_id);
        n.setCur_state(cur_state);
        n.setPosition(position);
        moveTableRepository.save(n);
        return "Saved";
    }

    @PostMapping(path = "/game-status")
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

    @PostMapping(value = "/saveLastValue")
    public @ResponseBody
    String findNextPlayer(@RequestParam Integer game_id
            , @RequestParam String lastValue, @RequestParam Integer lastPosition) {
        Optional<GameTable> saveLastValue = gameTableRepository.findById(game_id);

        if (saveLastValue.isPresent()) {
            GameTable saveGameData = saveLastValue.get();
            saveGameData.setGameId(game_id);
            saveGameData.setLastValue(lastValue);
            saveGameData.setLastPosition(lastPosition);
            if (saveGameData.getNext().equals(saveGameData.getFirstPlayer())) {
                saveGameData.setNext(saveGameData.getSecondPlayer());
            } else if (saveGameData.getNext().equals(saveGameData.getSecondPlayer())) {
                saveGameData.setNext(saveGameData.getFirstPlayer());
            }
            gameTableRepository.save(saveGameData);
            return "Saved";
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }

    @RequestMapping(value = "/whoNext")
    public @ResponseBody
    SendNext whoIsNext(@RequestParam Integer game_id) {
        Optional<GameTable> whoNext = gameTableRepository.findById(game_id);
        if (whoNext.isPresent()) {
//            if(whoNext.get().getLastValue()==='X'){
//                string nextValue= 'O';
//            }
//            else{
//                string nextValue= 'X';
//            }
            return new SendNext(whoNext.get().getNext(),
                    whoNext.get().getLastValue(),
                    whoNext.get().getLastPosition());
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Game Not Found");
        }
    }

//    @RequestMapping(value = "/setWho-next")
//    public @ResponseBody
//    FindNextPlayerId nextPlayer(@RequestParam Integer user_id, @RequestParam Integer game_id) {
//        Optional<GameTable>  setNextPlayerId = gameTableRepository.findById(game_id);
//        if(setNextPlayerId.isPresent()){
//            GameTable tableData = setNextPlayerId.get();
//            if(tableData.getFirstPlayer() == user_id){
//                tableData.setNext(tableData.getSecondPlayer() );
//            }
//            else if(tableData.getSecondPlayer() == user_id){
//                tableData.setNext(tableData.getFirstPlayer() );
//            }
//            Optional<GameTable> receiveNextPlayerId = gameTableRepository.findById(game_id);
//            if(receiveNextPlayerId.isPresent()){
//                return new FindNextPlayerId (receiveNextPlayerId.get().getNext());
//            }
//        }
//
//            throw new ResponseStatusException(
//                    HttpStatus.NOT_FOUND, "Game Not Found");
//    }

    @RequestMapping(value = "/start-response")
    public @ResponseBody
    CreateGameResponse isStartResponse(@RequestParam Integer game_id) {
        Optional<GameTable> currentStatus = gameTableRepository.findById(game_id);
        if (currentStatus.isPresent()) {
            return new CreateGameResponse(currentStatus.get().getGameId(), currentStatus.get().getFirstPlayer(), currentStatus.get().getStatus());
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
            m.setNext(userId);
            //m.setLastValue("X");
            //m.setNext(userId);
            GameTable insertedGame = gameTableRepository.save(m);
            return new CreateGameResponse(insertedGame.getGameId(), insertedGame.getFirstPlayer(), insertedGame.getStatus());
        } else { //second player
            GameTable pairedGame = gameTableRepository.findGameTableBySecondPlayer(userId);
            return new CreateGameResponse(pairedGame.getGameId(), pairedGame.getSecondPlayer(), pairedGame.getStatus());

        }

    }

}


