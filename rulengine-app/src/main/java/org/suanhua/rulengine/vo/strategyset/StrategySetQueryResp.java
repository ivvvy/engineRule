/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategySetQueryResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategyset
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 18:02
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategyset;

import org.suanhua.rulengine.vo.PageVO;
import org.suanhua.rulengine.vo.RulengineResponse;

/**
 * 策略集查询response
 *
 * @author: jie.qian
 * @date: 2017-08-14 18:02
 */
public class StrategySetQueryResp extends RulengineResponse {
    private PageVO<StrategySetVO> data;   //策略集查询列表结果

    public PageVO<StrategySetVO> getData() {
        return data;
    }

    public void setData(PageVO<StrategySetVO> data) {
        this.data = data;
    }
}
