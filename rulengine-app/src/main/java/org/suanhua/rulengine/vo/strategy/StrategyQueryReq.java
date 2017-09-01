/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategyQueryReq.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategy
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 16:10
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategy;

import org.suanhua.rulengine.vo.SortParamVO;

/**
 * 策略查询request
 * @author: jie.qian
 * @date: 2017-08-14 16:10  
 */
public class StrategyQueryReq {
    private StrategyQueryParam queryParam;   //查询参数
    private SortParamVO sortParam;   //分页参数

    public StrategyQueryParam getQueryParam() {
        return queryParam;
    }

    public void setQueryParam(StrategyQueryParam queryParam) {
        this.queryParam = queryParam;
    }

    public SortParamVO getSortParam() {
        return sortParam;
    }

    public void setSortParam(SortParamVO sortParam) {
        this.sortParam = sortParam;
    }
}
