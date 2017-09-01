/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: DecisionFlowQueryReq.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.decisionflow
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-28 11:05
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.decisionflow;

import org.suanhua.rulengine.vo.SortParamVO;

/**
 * @author: jie.qian
 * @date: 2017-08-28 11:05
 */
public class DecisionFlowQueryReq {
    private DecisionFlowQueryParam queryParam;

    private SortParamVO sortParam;

    public DecisionFlowQueryParam getQueryParam() {
        return queryParam;
    }

    public void setQueryParam(DecisionFlowQueryParam queryParam) {
        this.queryParam = queryParam;
    }

    public SortParamVO getSortParam() {
        return sortParam;
    }

    public void setSortParam(SortParamVO sortParam) {
        this.sortParam = sortParam;
    }
}
