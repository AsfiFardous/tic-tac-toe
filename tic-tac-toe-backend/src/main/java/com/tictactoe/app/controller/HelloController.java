package com.tictactoe.app.controller;

import com.tictactoe.app.responses.Resp;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RequestMapping(path="/demo")
@RestController
public class HelloController {
    @RequestMapping(value = {"/hello", "/hi"})
    public Resp sayHello(@RequestParam("name") String name) {
        System.out.println(name);
        return new Resp("something", "another thing");
    }
}
