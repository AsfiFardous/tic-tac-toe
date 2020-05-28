package com.tictactoe.app.repository;

import com.tictactoe.app.entity.GameTable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public interface GameTableRepository extends CrudRepository<GameTable, Integer> {
    @Modifying
    @Query("update GameTable u set u.secondPlayer =:user_id, u.secondUsername =:username, u.status='Started' where u.status = 'Waiting' ")
    int pairUser(@Param("user_id") int user_id,@Param("username") String username);

    GameTable findGameTableBySecondPlayer(int user_id2);
    GameTable findByGameId(int gameId);
    @Modifying
    @Query("update GameTable u set u.secondPlayer =:user_id, u.secondUsername =:username, u.status='Started' where u.status = 'WaitingForFriend' and u.gameId=:game_id")
    int pairFriend(@Param("user_id") int user_id,@Param("username") String username, @Param("game_id") int game_id);

}
