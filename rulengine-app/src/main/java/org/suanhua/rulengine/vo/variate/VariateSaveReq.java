/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: VariateSaveReq.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.variate
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 17:35
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.variate;

import org.suanhua.rulengine.dao.domain.BaseVariate;

/**
 * 新增数据request
 *
 * @author: jie.qian
 * @date: 2017-08-14 17:35
 */
public class VariateSaveReq {
    private BaseVariate saveData;   //新增数据

    public BaseVariate getSaveData() {
        return saveData;
    }

    public void setSaveData(BaseVariate saveData) {
        this.saveData = saveData;
    }

}
