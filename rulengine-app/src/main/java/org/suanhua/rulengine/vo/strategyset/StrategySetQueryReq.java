/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategySetQueryReq.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategyset
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 17:58
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategyset;

import org.suanhua.rulengine.vo.SortParamVO;

/**
 * 策略集查询request
 * @author: jie.qian
 * @date: 2017-08-14 17:58  
 */
public class StrategySetQueryReq {
    private StrategySetQueryParam queryParam;   //查询参数
    private SortParamVO sortParam;   //分页参数

    public StrategySetQueryParam getQueryParam() {
        return queryParam;
    }

    public void setQueryParam(StrategySetQueryParam queryParam) {
        this.queryParam = queryParam;
    }

    public SortParamVO getSortParam() {
        return sortParam;
    }

    public void setSortParam(SortParamVO sortParam) {
        this.sortParam = sortParam;
    }
}
