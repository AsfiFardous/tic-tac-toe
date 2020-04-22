package com.tictactoe.app.repository;

import com.tictactoe.app.entity.MoveTable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

@Component
public interface MoveTableRepository extends CrudRepository<MoveTable, Integer> {

}