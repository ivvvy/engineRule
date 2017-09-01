/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: FuzzyMatchResp.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.fuzzymatch
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-29 9:38
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.fuzzymatch;

import org.suanhua.rulengine.vo.RulengineResponse;

import java.util.List;

/**
 * @author: jie.qian
 * @date: 2017-08-29 9:38  
 */
public class FuzzyMatchResp<V> extends RulengineResponse {
    private List<V> data;

    public List<V> getData() {
        return data;
    }

    public void setData(List<V> data) {
        this.data = data;
    }
}
