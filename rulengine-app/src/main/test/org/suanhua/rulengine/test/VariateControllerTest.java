/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: VariateControllerTest.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.test
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-29 14:13
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
import org.suanhua.rulengine.web.controller.StrategyController;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
/**
 * @author: jie.qian
 * @date: 2017-08-29 14:13  
 */
public class VariateControllerTest extends BaseTast {

    @Autowired
    private WebApplicationContext wac;
    private MockMvc mockMvc;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void addTest() throws Exception{
        this.mockMvc.perform(post("rulengine/public/variate/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode",is("00")));
    }

    @Test
    public void queryTest() throws Exception{
        this.mockMvc.perform(post("rulengine/public/variate/query")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode",is("00")));
    }

    @Test
    public void updateTest() throws Exception{
        this.mockMvc.perform(post("rulengine/public/variate/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode",is("00")));
    }

    @Test
    public void deleteTest() throws Exception{
        this.mockMvc.perform(post("rulengine/public/variate/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode",is("00")));
    }


}
