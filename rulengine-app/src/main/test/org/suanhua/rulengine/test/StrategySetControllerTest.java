/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategySetControllerTest.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.test
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-31 18:37
 * @version: V1.0.0
 */

package org.suanhua.rulengine.test;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author: jie.qian
 * @date: 2017-08-31 18:37  
 */
public class StrategySetControllerTest  extends BaseTast{
    @Autowired
    private WebApplicationContext wac;
    private MockMvc mockMvc;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void addTest() throws Exception{
        this.mockMvc.perform(post("/rulengine/public/strategyset/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\n" +
                                "    \"saveData\":{\n" +
                                "        \"strategySetName\":\"PAPAPFFFABIUBIU\",\n" +
                                "        \"compilingStatus\":\"1\",\n" +
                                "        \"description\":\"不要喝水\",\n" +
                                "        \"sort\":\"不要蛀牙\"\n" +
                                "\n" +
                                "    },\n" +
                                "    \"refInfo\":[{\n" +
                                "        \"runLevel\":\"500\",\n" +
                                "        \"controlNo\":\"RULE201708310000\",\n" +
                                "        \"strategyName\":\"rule_hh_4M\"\n" +
                                "    }]\n" +
                                "}")
        )
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode", is("00")));
    }

    @Test
    public void queryTest() throws Exception{
        this.mockMvc.perform(post("/rulengine/public/strategyset/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}")
        )
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode", is("00")));
    }

    @Test
    public void updateTest() throws Exception{
        this.mockMvc.perform(post("/rulengine/public/strategyset/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\n" +
                                "    \"updateData\":{\n" +
                                "        \"controlNo\":\"SET201708310004\",\n" +
                                "        \"strategySetName\":\"BIUBIUBIU\",\n" +
                                "        \"compilingStatus\":\"1\",\n" +
                                "        \"description\":\"不要秃顶\",\n" +
                                "        \"sort\":\"不要蛀牙\"\n" +
                                "\n" +
                                "    },\n" +
                                "    \"refInfo\":[{\n" +
                                "        \"runLevel\":\"900\",\n" +
                                "        \"controlNo\":\"RULE201708310000\",\n" +
                                "        \"strategyName\":\"rule_hh_4M\"\n" +
                                "    }]\n" +
                                "}")
        )
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode", is("00")));
    }
}
