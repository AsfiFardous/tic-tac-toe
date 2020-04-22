package com.tictactoe.app;

import org.junit.Assert;
import org.junit.Test;

public class AdderTest {
    @Test
    public void testAddPositiveNo(){
        Adder adder = new Adder();

        int ret = adder.add(10, 11);

        Assert.assertEquals(21, ret);
    }

    @Test
    public void testAddNegativeNo(){
        Adder adder = new Adder();

        int ret = adder.add(-10, -11);

        Assert.assertEquals(-21, ret);
    }
}
