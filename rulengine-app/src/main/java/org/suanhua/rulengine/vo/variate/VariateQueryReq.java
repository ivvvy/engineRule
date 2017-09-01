package org.suanhua.rulengine.vo.variate;

import org.suanhua.rulengine.vo.SortParamVO;

/**
 * 变量查询参数
 * Created by jie.qian on 2017/8/1.
 */
public class VariateQueryReq{
    private VariateQueryParam queryParam;
    private SortParamVO sortparam;

    public VariateQueryParam getQueryParam() {
        return queryParam;
    }

    public void setQueryParam(VariateQueryParam queryParam) {
        this.queryParam = queryParam;
    }

    public SortParamVO getSortparam() {
        return sortparam;
    }

    public void setSortparam(SortParamVO sortparam) {
        this.sortparam = sortparam;
    }
}
