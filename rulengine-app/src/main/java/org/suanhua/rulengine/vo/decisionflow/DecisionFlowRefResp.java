/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: DecisionFlowRefResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.decisionflow
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-28 11:56
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.decisionflow;

import org.suanhua.rulengine.vo.RulengineResponse;
import org.suanhua.rulengine.vo.reference.ReferenceQueryResult;

/**
 * @author: jie.qian
 * @date: 2017-08-28 11:56
 */
public class DecisionFlowRefResp extends RulengineResponse {
    private ReferenceQueryResult data;

    public ReferenceQueryResult getData() {
        return data;
    }

    public void setData(ReferenceQueryResult data) {
        this.data = data;
    }
}
