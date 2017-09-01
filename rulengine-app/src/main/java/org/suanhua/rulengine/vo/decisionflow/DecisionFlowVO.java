/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: DecisionFlowVO.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.decisionflow
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-28 11:38
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.decisionflow;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

/**
 * @author: jie.qian
 * @date: 2017-08-28 11:38
 */
public class DecisionFlowVO {
    private Integer id; // 流水号，无业务含义，自增
    private String dflowName;       //决策流名称
    private String dflowBodys;      //决策流体
    private String dflowBodyJson;   //决策流体Json
    private Integer compilingStatus;    //编译状态
    private String controlNo; // 编号
    private String versions; // 版本号
    private String orgId; // 机构号
    private String sort; // 分类
    private String description; // 描述
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime; // 创建时间
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime; // 修改时间
    private Integer isLock; // 是否加锁 0 否 1 是
    private String userId; // 锁拥有者 userId

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDflowName() {
        return dflowName;
    }

    public void setDflowName(String dflowName) {
        this.dflowName = dflowName;
    }

    public String getDflowBodys() {
        return dflowBodys;
    }

    public void setDflowBodys(String dflowBodys) {
        this.dflowBodys = dflowBodys;
    }

    public String getDflowBodyJson() {
        return dflowBodyJson;
    }

    public void setDflowBodyJson(String dflowBodyJson) {
        this.dflowBodyJson = dflowBodyJson;
    }

    public Integer getCompilingStatus() {
        return compilingStatus;
    }

    public void setCompilingStatus(Integer compilingStatus) {
        this.compilingStatus = compilingStatus;
    }

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

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
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
}
