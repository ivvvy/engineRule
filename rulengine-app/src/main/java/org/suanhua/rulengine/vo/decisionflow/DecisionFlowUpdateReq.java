/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: DecisionFlowUpdateReq.java
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
public class DecisionFlowUpdateReq {
    private DecisionFlow updateData;
    private List<ReferenceInfo> refInfo;

    public DecisionFlow getUpdateData() {
        return updateData;
    }

    public void setUpdateData(DecisionFlow updateData) {
        this.updateData = updateData;
    }

    public List<ReferenceInfo> getRefInfo() {
        return refInfo;
    }

    public void setRefInfo(List<ReferenceInfo> refInfo) {
        this.refInfo = refInfo;
    }
}
