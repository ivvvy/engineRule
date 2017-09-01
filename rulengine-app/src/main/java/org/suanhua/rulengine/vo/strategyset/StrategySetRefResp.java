/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategySetRefResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategyset
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 18:09
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategyset;

import org.suanhua.rulengine.vo.reference.ReferenceQueryResult;

/**
 * 策略集引用列表查询response
 * @author: jie.qian
 * @date: 2017-08-14 18:09  
 */
public class StrategySetRefResp {
    private ReferenceQueryResult data;   //引用和被引用关系

    public ReferenceQueryResult getData() {
        return data;
    }

    public void setData(ReferenceQueryResult data) {
        this.data = data;
    }
}
