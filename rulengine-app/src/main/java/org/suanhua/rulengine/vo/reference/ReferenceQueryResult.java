/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: ReferenceQueryResult.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.reference
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 16:55
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.reference;

import java.util.List;

/**
 * @author: jie.qian
 * @date: 2017-08-14 16:55
 */
public class ReferenceQueryResult {
    private List<ReferenceVO> refInfo;   //引用列表
    private List<ReferenceVO> beRefInfo;   //被引用列表

    public List<ReferenceVO> getBeRefInfo() {
        return beRefInfo;
    }

    public void setBeRefInfo(List<ReferenceVO> beRefInfo) {
        this.beRefInfo = beRefInfo;
    }

    public List<ReferenceVO> getRefInfo() {
        return refInfo;
    }

    public void setRefInfo(List<ReferenceVO> refInfo) {
        this.refInfo = refInfo;
    }
}
