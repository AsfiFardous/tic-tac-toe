package com.tictactoe.app.repository;

import com.tictactoe.app.entity.GameTable;
import org.springframework.data.repository.CrudRepository;


public interface GameTableRepository extends CrudRepository<GameTable, Integer> {

}
