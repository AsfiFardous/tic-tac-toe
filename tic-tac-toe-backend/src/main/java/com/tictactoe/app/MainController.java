package com.tictactoe.app;

import com.tictactoe.app.entity.MoveTable;
import com.tictactoe.app.repository.MoveTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(path="/demo")
public class MainController {
    @Autowired
    private MoveTableRepository moveTableRepository;

    @PostMapping(path="/add") // Map ONLY POST Requests
    public @ResponseBody String addNewGame (@RequestParam String cur_state
            , @RequestParam Integer position) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        MoveTable n = new MoveTable();
        n.setCur_state(cur_state);
        n.setPosition(position);
        moveTableRepository.save(n);
        return "Saved";
    }

    @GetMapping(path="/all")
    public @ResponseBody Iterable<MoveTable> getAllInfo() {
        // This returns a JSON or XML with the users
        return moveTableRepository.findAll();
    }
}





