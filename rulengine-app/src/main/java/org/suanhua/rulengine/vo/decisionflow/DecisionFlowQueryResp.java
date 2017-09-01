/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: DecisionFlowQueryResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.decisionflow
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-28 10:32
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.decisionflow;

import org.suanhua.rulengine.dao.domain.DecisionFlow;
import org.suanhua.rulengine.vo.PageVO;
import org.suanhua.rulengine.vo.RulengineResponse;

/**
 * @author: jie.qian
 * @date: 2017-08-28 10:32
 */
public class DecisionFlowQueryResp extends RulengineResponse {
    private PageVO<DecisionFlow> data;

    public PageVO<DecisionFlow> getData() {
        return data;
    }

    public void setData(PageVO<DecisionFlow> data) {
        this.data = data;
    }
}
