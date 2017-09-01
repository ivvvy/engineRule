/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategySetSaveReq.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategyset
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 18:13
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategyset;

import org.suanhua.rulengine.dao.domain.ReferenceInfo;
import org.suanhua.rulengine.dao.domain.Strategy;
import org.suanhua.rulengine.dao.domain.StrategySet;

import java.util.List;

/**
 * 新增策略集request
 * @author: jie.qian
 * @date: 2017-08-14 18:13  
 */
public class StrategySetSaveReq {
    private StrategySet saveData;   //新增策略集数据
    private List<StrategyWithRunLevel> refInfo;   //对策略的引用

    public StrategySet getSaveData() {
        return saveData;
    }

    public void setSaveData(StrategySet saveData) {
        this.saveData = saveData;
    }

    public List<StrategyWithRunLevel> getRefInfo() {
        return refInfo;
    }

    public void setRefInfo(List<StrategyWithRunLevel> refInfo) {
        this.refInfo = refInfo;
    }
}
