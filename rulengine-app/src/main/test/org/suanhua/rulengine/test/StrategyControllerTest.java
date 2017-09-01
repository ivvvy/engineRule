/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategyControllerTest.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.test
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-21 8:36
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
 * @date: 2017-08-21 8:36
 */
public class StrategyControllerTest extends BaseTast {

    @Autowired
    private WebApplicationContext wac;
    private MockMvc mockMvc;

    @Before
    public void setUp() {
//        mockMvc = MockMvcBuilders.standaloneSetup(strategyController).build();
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void queryTest() throws Exception {
        this.mockMvc.perform(post("/rulengine/public/strategy/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\n" +
                                "    \"queryParam\": {\n" +
                                "        \"strategyType\": \"评分卡%%\",\n" +
                                "        \"sort\": \"\",\n" +
                                "        \"name\": \"\",\n" +
                                "        \"description\": \"\",\n" +
                                "        \"status\": \"\",\n" +
                                "        \"startDate\": \"\",\n" +
                                "        \"endDate\": \"\"\n" +
                                "    },\n" +
                                "    \"sortParam\": {\n" +
                                "        \"pageNum\": \"\",\n" +
                                "        \"pageSize\": \"\",\n" +
                                "        \"sortField\": \"\",\n" +
                                "        \"order\": \"\"\n" +
                                "    }\n" +
                                "}")
        )
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode", is("00")));
    }

    @Test
    public void addTest() throws Exception {
        this.mockMvc.perform(post("/rulengine/public/strategy/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\n" +
                                "    \"saveData\": {\n" +
                                "        \"sort\":\"一棵树\",\n" +
                                "        \"description\":\"你好\",\n" +
                                "        \"strategyType\":\"TREE\",\n" +
                                "        \"strategyName\":\"TREE_87JU_SD3D\",\n" +
                                "        \"strategyBody\":\"{}\",\n" +
                                "        \"strategyJson\":\"{}\",\n" +
                                "        \"show\":\"<>\",\n" +
                                "        \"rowVar\":\"VAR_1002\",\n" +
                                "        \"lineVar\":\"VAR_1099\",\n" +
                                "        \"resultVar\":\"VAR_1200\"\n" +
                                "    },\n" +
                                "    \"refInfo\": [{\n" +
                                "        \"controlNo\":\"\",\n" +
                                "        \"versions\":\"\",\n" +
                                "        \"typeName\":\"\",\n" +
                                "        \"elementName\":\"\",\n" +
                                "    }]\n" +
                                "}")
        )
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode", is("00")));
    }

    @Test
    public void updateTest() throws Exception {
        this.mockMvc.perform(post("/rulengine/public/strategy/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\n" +
                                "    \"updateData\": {\n" +
                                "        \"strategyName\":\"\",\n" +
                                "        \"sort\":\"\",\n" +
                                "        \"strategyType\":\"\",\n" +
                                "        \"strategyBody\":\"\",\n" +
                                "        \"strategyJson\":\"\",\n" +
                                "        \"show\":\"\",\n" +
                                "        \"rowVar\":\"\",\n" +
                                "        \"lineVar\":\"\",\n" +
                                "        \"resultVar\":\"\"\n" +
                                "    },\n" +
                                "    \"refInfo\": [{\n" +
                                "        \"controlNo\":\"\",\n" +
                                "        \"versions\":\"\",\n" +
                                "        \"typeName\":\"\",\n" +
                                "        \"elementName\":\"\",\n" +
                                "        \"refTypeName\":\"\",\n" +
                                "        \"refvarName\":\"\",\n" +
                                "        \"refversions\":\"\",\n" +
                                "        \"refvarNum\":\"\"\n" +
                                "    }]\n" +
                                "}")
        )
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode", is("00")));
    }

    @Test
    public void deleteTest() throws Exception {
        this.mockMvc.perform(post("/rulengine/public/strategy/delete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\n" +
                                "    \"controlNo\":\"\"\n" +
                                "}")
        )
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode", is("00")));
    }

    @Test
    public void checkoutTest() throws Exception {
        this.mockMvc.perform(post("/rulengine/public/strategy/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\n" +
                                "    \"controlNo\":\"\"\n" +
                                "}")
        )
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("retCode", is("00")));
    }
}
