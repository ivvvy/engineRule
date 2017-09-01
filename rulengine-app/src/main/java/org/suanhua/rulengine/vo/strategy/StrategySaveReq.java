/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategySaveReq.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategy
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 16:50
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategy;

import org.suanhua.rulengine.dao.domain.ReferenceInfo;
import org.suanhua.rulengine.dao.domain.Strategy;

import java.util.List;

/**
 * 新增策略request
 * @author: jie.qian
 * @date: 2017-08-14 16:50  
 */
public class StrategySaveReq {
    private Strategy saveData;   //新增策略数据
    private List<ReferenceInfo> refInfo;   //引用关系

    public Strategy getSaveData() {
        return saveData;
    }

    public void setSaveData(Strategy saveData) {
        this.saveData = saveData;
    }

    public List<ReferenceInfo> getRefInfo() {
        return refInfo;
    }

    public void setRefInfo(List<ReferenceInfo> refInfo) {
        this.refInfo = refInfo;
    }
}
