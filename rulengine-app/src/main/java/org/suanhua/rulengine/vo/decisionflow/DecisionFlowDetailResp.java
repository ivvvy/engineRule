/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: DecisionFlowDetailResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.decisionflow
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-30 14:52
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.decisionflow;

import org.suanhua.rulengine.vo.RulengineResponse;

/**
 * 决策流根据编号查询单条记录
 * @author: jie.qian
 * @date: 2017-08-30 14:52  
 */
public class DecisionFlowDetailResp extends RulengineResponse {
    private DecisionFlowVO data;

    public DecisionFlowVO getData() {
        return data;
    }

    public void setData(DecisionFlowVO data) {
        this.data = data;
    }
}
