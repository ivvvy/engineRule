/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: ReferenceVO.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo.reference
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 16:44
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo.reference;

/**
 * @author: jie.qian
 * @date: 2017-08-14 16:44  
 */
public class ReferenceVO {
    private String controlNo;    //被引用者编号
    private String versions;    //被引用者版本号
    private String typeName;    //被引用者类别名称
    private String elementName;    //被引用者名称
    private String refTypeName;    //引用者类别名称
    private String refvarName;    //引用者名称
    private String refversions;    //引用者版本号
    private String refvarNum;    //引用者编号

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

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getElementName() {
        return elementName;
    }

    public void setElementName(String elementName) {
        this.elementName = elementName;
    }

    public String getRefTypeName() {
        return refTypeName;
    }

    public void setRefTypeName(String refTypeName) {
        this.refTypeName = refTypeName;
    }

    public String getRefvarName() {
        return refvarName;
    }

    public void setRefvarName(String refvarName) {
        this.refvarName = refvarName;
    }

    public String getRefversions() {
        return refversions;
    }

    public void setRefversions(String refversions) {
        this.refversions = refversions;
    }

    public String getRefvarNum() {
        return refvarNum;
    }

    public void setRefvarNum(String refvarNum) {
        this.refvarNum = refvarNum;
    }
}
