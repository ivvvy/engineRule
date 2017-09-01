/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategySetUpdateReq.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategyset
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 18:17
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategyset;

import org.suanhua.rulengine.dao.domain.ReferenceInfo;
import org.suanhua.rulengine.dao.domain.StrategySet;

import java.util.List;

/**
 * @author: jie.qian
 * @date: 2017-08-14 18:17
 */
public class StrategySetUpdateReq {
    private StrategySet updateData;   //更新策略数据

    private List<StrategyWithRunLevel> refInfo;    //引用关系

    public StrategySet getUpdateData() {
        return updateData;
    }

    public void setUpdateData(StrategySet updateData) {
        this.updateData = updateData;
    }

    public List<StrategyWithRunLevel> getRefInfo() {
        return refInfo;
    }

    public void setRefInfo(List<StrategyWithRunLevel> refInfo) {
        this.refInfo = refInfo;
    }
}
