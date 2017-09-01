/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategyWithRunLevel.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategyset
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-31 11:52
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategyset;

import org.suanhua.rulengine.vo.strategy.StrategyVO;

/**
 * @author: jie.qian
 * @date: 2017-08-31 11:52
 */
public class StrategyWithRunLevel extends StrategyVO {
    private Integer runLevel;

    public Integer getRunLevel() {
        return runLevel;
    }

    public void setRunLevel(Integer runLevel) {
        this.runLevel = runLevel;
    }
}
