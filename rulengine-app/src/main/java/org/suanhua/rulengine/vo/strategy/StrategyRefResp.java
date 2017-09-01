/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategyRefResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategy
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 16:53
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategy;

import org.suanhua.rulengine.vo.RulengineResponse;
import org.suanhua.rulengine.vo.reference.ReferenceQueryResult;

/**
 * 策略引用列表查询response
 * @author: jie.qian
 * @date: 2017-08-14 16:53  
 */
public class StrategyRefResp extends RulengineResponse{
    private ReferenceQueryResult data;   //引用和被引用关系

    public ReferenceQueryResult getData() {
        return data;
    }

    public void setData(ReferenceQueryResult data) {
        this.data = data;
    }
}
