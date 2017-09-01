/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: DecisionFlowSaveReq.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.decisionflow
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-28 11:53
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.decisionflow;

import org.suanhua.rulengine.dao.domain.DecisionFlow;
import org.suanhua.rulengine.dao.domain.ReferenceInfo;

import java.util.List;

/**
 * @author: jie.qian
 * @date: 2017-08-28 11:53
 */
public class DecisionFlowSaveReq {
    private DecisionFlow saveData;          //新增策略数据
    private List<ReferenceInfo> refInfo;    //引用关系

    public DecisionFlow getSaveData() {
        return saveData;
    }

    public void setSaveData(DecisionFlow saveData) {
        this.saveData = saveData;
    }

    public List<ReferenceInfo> getRefInfo() {
        return refInfo;
    }

    public void setRefInfo(List<ReferenceInfo> refInfo) {
        this.refInfo = refInfo;
    }
}
