/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategySetDetailResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategyset
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-24 16:04
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategyset;

import org.suanhua.rulengine.vo.RulengineResponse;
import org.suanhua.rulengine.vo.strategy.StrategyVO;

import java.util.List;

/**
 * @author: jie.qian
 * @date: 2017-08-24 16:04  
 */
public class StrategySetDetailResp extends RulengineResponse{
    List<StrategyVO> data;

    public List<StrategyVO> getData() {
        return data;
    }

    public void setData(List<StrategyVO> data) {
        this.data = data;
    }
}
