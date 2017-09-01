/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategyDetailResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategy
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-30 10:19
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategy;

import org.suanhua.rulengine.vo.RulengineResponse;

/**
 * 根据编号获取策略详情Model
 *
 * @author: jie.qian
 * @date: 2017-08-30 10:19
 */
public class StrategyDetailResp extends RulengineResponse {
    private StrategyVO data;

    public StrategyVO getData() {
        return data;
    }

    public void setData(StrategyVO data) {
        this.data = data;
    }
}
