package org.suanhua.rulengine.vo.variate;

import org.suanhua.rulengine.dao.domain.BaseVariate;
import org.suanhua.rulengine.dao.domain.ReferenceInfo;

import java.util.List;

/**
 * 修改变量request
 *  根据所传updateData中的编号以及refInfo修改对应变量，更新引用关系
 * Created by jie.qian on 2017/8/2.
 */

public class VariateUpdateReq {
    private BaseVariate updateData;   //修改数据
    private List<ReferenceInfo> refInfo;   //引用关系

    public BaseVariate getUpdateData() {
        return updateData;
    }

    public void setUpdateData(BaseVariate updateData) {
        this.updateData = updateData;
    }

    public List<ReferenceInfo> getRefInfo() {
        return refInfo;
    }

    public void setRefInfo(List<ReferenceInfo> refInfo) {
        this.refInfo = refInfo;
    }
}
