/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategyVO.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.strategy
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 16:27
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.strategy;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

/**
 * 策略VO类
 *
 * @author: jie.qian
 * @date: 2017-08-14 16:27
 */
public class StrategyVO {
    private String controlNo;   //编号
    private String versions;   //版本号
    private String orgId;   //机构号
    private String sort;   //分类
    private String description;   //描述
    private String creater;   //创建者
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;   //创建时间
    private String updater;   //修改者
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;   //修改时间
    private String status;   //状态码
    private Integer isLock;   //是否加锁0否1是
    private String userId;   //锁拥有者 userId
    private String strategyType;   //策略类型
    private String strategyName;   //策略名称
    private String strategyBody;   //策略体
    private String strategyJson;   //策略体Json
    private String show;   //展现字段
    private String rowVar;   //行变量
    private String lineVar;   //列变量
    private String resultVar;   //结果策略
    private Integer compilingStatus;   //编译状态

    public String getControlNo() {
        return controlNo;
    }

    public void setControlNo(String controlNo) {
        this.controlNo = controlNo;
    }

    public String getVersions() {
        return versions;
    }

    public void setVersions(String versions) {
        this.versions = versions;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreater() {
        return creater;
    }

    public void setCreater(String creater) {
        this.creater = creater;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdater() {
        return updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getIsLock() {
        return isLock;
    }

    public void setIsLock(Integer isLock) {
        this.isLock = isLock;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getStrategyType() {
        return strategyType;
    }

    public void setStrategyType(String strategyType) {
        this.strategyType = strategyType;
    }

    public String getStrategyName() {
        return strategyName;
    }

    public void setStrategyName(String strategyName) {
        this.strategyName = strategyName;
    }

    public String getStrategyBody() {
        return strategyBody;
    }

    public void setStrategyBody(String strategyBody) {
        this.strategyBody = strategyBody;
    }

    public String getStrategyJson() {
        return strategyJson;
    }

    public void setStrategyJson(String strategyJson) {
        this.strategyJson = strategyJson;
    }

    public String getShow() {
        return show;
    }

    public void setShow(String show) {
        this.show = show;
    }

    public String getRowVar() {
        return rowVar;
    }

    public void setRowVar(String rowVar) {
        this.rowVar = rowVar;
    }

    public String getLineVar() {
        return lineVar;
    }

    public void setLineVar(String lineVar) {
        this.lineVar = lineVar;
    }

    public String getResultVar() {
        return resultVar;
    }

    public void setResultVar(String resultVar) {
        this.resultVar = resultVar;
    }

    public Integer getCompilingStatus() {
        return compilingStatus;
    }

    public void setCompilingStatus(Integer compilingStatus) {
        this.compilingStatus = compilingStatus;
    }
}
