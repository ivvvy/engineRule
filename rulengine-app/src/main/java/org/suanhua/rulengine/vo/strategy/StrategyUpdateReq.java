/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategyUpdateReq.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategy
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 16:41
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategy;

import org.suanhua.rulengine.dao.domain.ReferenceInfo;
import org.suanhua.rulengine.dao.domain.Strategy;

import java.util.List;

/**
 * 修改策略reqest
 * 根据所传updateData中的编号以及refInfo修改对应变量，更新引用关系
 * @author: jie.qian
 * @date: 2017-08-14 16:41  
 */
public class StrategyUpdateReq {
    private Strategy updateData;   //修改数据
    private List<ReferenceInfo> refInfo;   //引用关系

    public Strategy getUpdateData() {
        return updateData;
    }

    public void setUpdateData(Strategy updateData) {
        this.updateData = updateData;
    }

    public List<ReferenceInfo> getRefInfo() {
        return refInfo;
    }

    public void setRefInfo(List<ReferenceInfo> refInfo) {
        this.refInfo = refInfo;
    }
}
