/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: VariateQueryParam.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.variate
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 17:24
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.variate;

import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * @author: jie.qian
 * @date: 2017-08-14 17:24  
 */
public class VariateQueryParam {
    private String varType;   //变量类型
    private String sort;   //分类
    private String varName;   //变量名称
    private String description;   //描述
//    @DateTimeFormat(pattern="yyyy-MM-dd")
    private Date startDate;   //创建时间开始时间
//    @DateTimeFormat(pattern="yyyy-MM-dd")
    private Date endDate;   //创建时间结束时间

    public String getVarType() {
        return varType;
    }

    public void setVarType(String varType) {
        this.varType = varType;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getVarName() {
        return varName;
    }

    public void setVarName(String varName) {
        this.varName = varName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
}
