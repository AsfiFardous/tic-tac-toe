package com.tictactoe.app.repository;

import com.tictactoe.app.entity.GameTable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;


public interface GameTableRepository extends CrudRepository<GameTable, Integer> {
    @Modifying
    @Query("update GameTable u set u.secondPlayer =:user_id, u.status='Started' where u.status = 'Waiting'")
    int pairUser(@Param("user_id") int user_id);

    GameTable findGameTableBySecondPlayer(int user_id2);
}
