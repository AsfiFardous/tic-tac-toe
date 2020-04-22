package com.tictactoe.app.service;

import com.tictactoe.app.entity.GameTable;
import com.tictactoe.app.entity.MoveTable;
import com.tictactoe.app.repository.GameTableRepository;
import com.tictactoe.app.repository.MoveTableRepository;
import com.tictactoe.app.responses.CreateGameResponse;
import com.tictactoe.app.responses.SendNext;
import com.tictactoe.app.responses.StartGameResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;


import java.io.IOException;
import java.util.Optional;
import java.util.Random;

@Component
public class GameService {
    @Autowired
    private MoveTableRepository moveTableRepository;
    @Autowired
    private GameTableRepository gameTableRepository;

    public void addNewGame(Integer game_id, Integer user_id, String cur_state, Integer position) {
        MoveTable n = new MoveTable();
        n.setUser_id(user_id);
        n.setCur_state(cur_state);
        n.setPosition(position);
        moveTableRepository.save(n);
    }

    public boolean addGameStatus(Integer game_id, String winner, String status) {

        Optional<GameTable> gameDataOptional = gameTableRepository.findById(game_id);
        if (gameDataOptional.isPresent()) {
            GameTable gameData = gameDataOptional.get();
            gameData.setGameId(game_id);
            gameData.setWinner(winner);
            gameData.setStatus(status);
            gameTableRepository.save(gameData);
            return true;
        } else {
            return false;
        }
    }

    public boolean findNextPlayer(Integer game_id, String lastValue, Integer lastPosition) {
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
            return true;
        } else {
            return false;
        }

    }

    public SendNext whoIsNext(Integer game_id) {
        Optional<GameTable> whoNext = gameTableRepository.findById(game_id);
        if (whoNext.isPresent()) {
            return new SendNext(whoNext.get().getNext(),
                    whoNext.get().getLastValue(),
                    whoNext.get().getLastPosition(), whoNext.get().getStatus());
        } else {
            return null;
        }
    }

    public StartGameResponse isStartResponse(Integer game_id) {

        Optional<GameTable> currentStatus = gameTableRepository.findById(game_id);

        if (currentStatus.isPresent()) {
            GameTable gameTable = currentStatus.get();
            return new StartGameResponse(gameTable.getGameId(),
                    gameTable.getFirstPlayer(),
                    gameTable.getSecondPlayer(),
                    gameTable.getStatus(), gameTable.getFirstUsername(), gameTable.getSecondUsername());
        } else {
            return null;
        }
    }

    @Transactional
    public CreateGameResponse createGame(String username) {
        Random rand = new Random();
        int userId = rand.nextInt(1000);
        int updateCount = gameTableRepository.pairUser(userId, username);

        if (updateCount == 0) { //first player
            GameTable m = new GameTable();
            m.setFirstPlayer(userId);
            m.setStatus("Waiting");
            m.setNext(userId);
            m.setFirstUsername(username);
            GameTable insertedGame = gameTableRepository.save(m);
            return new CreateGameResponse(insertedGame.getGameId(), insertedGame.getFirstPlayer(), insertedGame.getFirstUsername(), insertedGame.getStatus(), insertedGame.getFirstUsername(), insertedGame.getSecondUsername());
        } else { //second player
            GameTable pairedGame = gameTableRepository.findGameTableBySecondPlayer(userId);
            return new CreateGameResponse(pairedGame.getGameId(), pairedGame.getSecondPlayer(), pairedGame.getSecondUsername(), pairedGame.getStatus(), pairedGame.getFirstUsername(), pairedGame.getSecondUsername());
        }
    }

    @Transactional
    public CreateGameResponse playGameWithFriend(String username, Integer gameId) {
        if (gameId == -1) {
            Random rand = new Random();
            int userId = rand.nextInt(1000);
            GameTable m = new GameTable();
            m.setFirstPlayer(userId);
            m.setStatus("WaitingForFriend");
            m.setNext(userId);
            m.setFirstUsername(username);
            GameTable insertedGame = gameTableRepository.save(m);
            return new CreateGameResponse(insertedGame.getGameId(), insertedGame.getFirstPlayer(), insertedGame.getFirstUsername(), insertedGame.getStatus(), insertedGame.getFirstUsername(), insertedGame.getSecondUsername());
        }
        else { //second player
            Random rand = new Random();
            int userId = rand.nextInt(1000);
            int updateCount = gameTableRepository.pairFriend(userId, username, gameId);
            if (updateCount > 0) {

                GameTable pairedGame = gameTableRepository.findGameTableBySecondPlayer(userId);
                return new CreateGameResponse(pairedGame.getGameId(), pairedGame.getSecondPlayer(), pairedGame.getSecondUsername(), pairedGame.getStatus(), pairedGame.getFirstUsername(), pairedGame.getSecondUsername());
            }
            else{
                return null;
            }
        }
    }
}
//    public CreateGameResponse playGameWithFriend(String username,Integer gameId) {
//        if(gameId == -1) {
//        }
//        Random rand = new Random();
//
//        int userId = rand.nextInt(1000);
//        int updateCount = gameTableRepository.pairFriend(userId, username);
//        if (updateCount == 0) {
//            GameTable m = new GameTable();
//            m.setFirstPlayer(userId);
//            m.setStatus("WaitingForFriend");
//            m.setNext(userId);
//            m.setFirstUsername(username);
//            GameTable insertedGame = gameTableRepository.save(m);
//            return new CreateGameResponse(insertedGame.getGameId(), insertedGame.getFirstPlayer(), insertedGame.getFirstUsername(), insertedGame.getStatus(), insertedGame.getFirstUsername(), insertedGame.getSecondUsername());
//        }
//        else { //second player
//
//            GameTable pairedGame = gameTableRepository.findGameTableBySecondPlayer(userId);
//            return new CreateGameResponse(pairedGame.getGameId(), pairedGame.getSecondPlayer(), pairedGame.getSecondUsername(), pairedGame.getStatus(), pairedGame.getFirstUsername(), pairedGame.getSecondUsername());
//          }
//        }




