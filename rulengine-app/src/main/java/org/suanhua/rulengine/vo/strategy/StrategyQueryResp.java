/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategyQueryResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategy
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 16:21
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategy;

import org.suanhua.rulengine.vo.PageVO;
import org.suanhua.rulengine.vo.RulengineResponse;

/**
 * 策略查询response
 *
 * @author: jie.qian
 * @date: 2017-08-14 16:21
 */
public class StrategyQueryResp extends RulengineResponse {
    private PageVO<StrategyVO> data;   //策略查询列表结果

    public PageVO getData() {
        return data;
    }

    public void setData(PageVO data) {
        this.data = data;
    }
}
