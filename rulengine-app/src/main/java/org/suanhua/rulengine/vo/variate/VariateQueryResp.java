package org.suanhua.rulengine.vo.variate;

import com.fasterxml.jackson.databind.deser.Deserializers;
import org.suanhua.rulengine.dao.domain.BaseVariate;
import org.suanhua.rulengine.vo.PageVO;
import org.suanhua.rulengine.vo.RulengineResponse;

/**
 * Created by jie.qian on 2017/8/2.
 */
public class VariateQueryResp extends RulengineResponse {
    private PageVO<VariateVO> data;

    public PageVO<VariateVO> getData() {
        return data;
    }

    public void setData(PageVO<VariateVO> data) {
        this.data = data;
    }
}
