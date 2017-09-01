/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: VariateVO.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.variate
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 17:18
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.variate;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * @author: jie.qian
 * @date: 2017-08-14 17:18  
 */
public class VariateVO {
    private String controlNo; // 编号
    private String versions; // 版本号
    private String orgId; // 机构号
    private String sort; // 分类
    private String description; // 描述
    private String creater; // 创建者
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime; // 创建时间
    private String updater; // 修改者
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime; // 修改时间
    private Integer status; // 状态码
    private Integer isLock; // 是否加锁 0 否 1 是
    private String userId; // 锁拥有者 userId
    private Integer varType;//变量类型
    private String varName; // 变量名
    private Integer length;//长度

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
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

    public String getCreater() {
        return creater;
    }

    public void setCreater(String creater) {
        this.creater = creater;
    }

    @DateTimeFormat(pattern = "yyyyMMddHHmmss")
    @JsonFormat(pattern = "yyyyMMddHHmmss")
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

    @DateTimeFormat(pattern = "yyyyMMddHHmmss")
    @JsonFormat(pattern = "yyyyMMddHHmmss")
    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
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

    public Integer getVarType() {
        return varType;
    }

    public void setVarType(Integer varType) {
        this.varType = varType;
    }

    public String getVarName() {
        return varName;
    }

    public void setVarName(String varName) {
        this.varName = varName;
    }
}
