/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategySetQueryDetailResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategyset
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-22 17:44
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategyset;

import org.suanhua.rulengine.vo.RulengineResponse;
import org.suanhua.rulengine.vo.strategy.StrategyVO;

import java.util.List;

/**
 * @author: jie.qian
 * @date: 2017-08-22 17:44
 */
public class StrategySetQueryDetailResp extends RulengineResponse {
    private StrategySetDetail data;         //策略集查询结果

    public StrategySetDetail getData() {
        return data;
    }

    public void setData(StrategySetDetail data) {
        this.data = data;
    }
}
