/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategySetDetail.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategyset
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-31 11:17
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategyset;

import org.suanhua.rulengine.vo.strategy.StrategyVO;

import java.util.List;

/**
 * @author: jie.qian
 * @date: 2017-08-31 11:17  
 */
public class StrategySetDetail {
    private StrategySetVO detail;
    private List<StrategyWithRunLevel> strategys;

    public StrategySetVO getDetail() {
        return detail;
    }

    public void setDetail(StrategySetVO detail) {
        this.detail = detail;
    }

    public List<StrategyWithRunLevel> getStrategys() {
        return strategys;
    }

    public void setStrategys(List<StrategyWithRunLevel> strategys) {
        this.strategys = strategys;
    }
}
