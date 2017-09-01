/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: ReferenceQueryResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.reference
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 18:56
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.reference;

import org.suanhua.rulengine.vo.RulengineResponse;

/**
 * 查询引用关系
 * @author: jie.qian
 * @date: 2017-08-14 18:56  
 */
public class ReferenceQueryResp  extends RulengineResponse{
    private ReferenceQueryResult data;

    public ReferenceQueryResult getData() {
        return data;
    }

    public void setData(ReferenceQueryResult data) {
        this.data = data;
    }
}
