/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategyQueryParam.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategy
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 16:12
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategy;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

/**
 * 策略查询参数
 * @author: jie.qian
 * @date: 2017-08-14 16:12
 */
public class StrategyQueryParam {
    private String strategyType;   //策略类型
    private String sort;   //策略分类
    private String strategyName;   //策略名称
    private String description;   //策略描述
    private Integer compilingStatus;   //策略状态
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startDate;   //创建开始时间
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endDate;   //创建结束时间

    public String getStrategyType() {
        return strategyType;
    }

    public void setStrategyType(String strategyType) {
        this.strategyType = strategyType;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getStrategyName() {
        return strategyName;
    }

    public void setStrategyName(String strategyName) {
        this.strategyName = strategyName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCompilingStatus() {
        return compilingStatus;
    }

    public void setCompilingStatus(Integer compilingStatus) {
        this.compilingStatus = compilingStatus;
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
