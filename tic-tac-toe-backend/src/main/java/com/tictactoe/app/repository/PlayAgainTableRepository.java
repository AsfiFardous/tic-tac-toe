package com.tictactoe.app.repository;
import com.tictactoe.app.entity.GameTable;
import com.tictactoe.app.entity.PlayAgainTable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public interface PlayAgainTableRepository extends CrudRepository<PlayAgainTable, Integer> {
    @Modifying
    @Query("update PlayAgainTable u set u.newGameId = :new_game_id, u.gameStatus='Yes' where u.gameId = :game_id")
    int insertGameId(@Param("game_id") int game_id ,@Param("new_game_id") int new_game_id );

    Optional<PlayAgainTable> findByGameId(int gameId);
}
