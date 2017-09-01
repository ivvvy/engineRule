/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: PageVO.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.vo
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-04 13:58
 * @version: V1.0.0
 */

package org.suanhua.rulengine.vo;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;

/**
 * @author: jie.qian
 * @date: 2017-08-04 13:58  
 */
public class PageVO<V> {
    private String order;                   //正反序
    private Integer pageCount;               //总页数
    private Integer currentPage;             //当前页
    private Integer pageSize;               //页大小
    private long rowCount;                //总条数
    private String sortField;               //排序字段
    private List<V> queryList;              //查询结果


    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public Integer getPageCount() {
        return pageCount;
    }

    public void setPageCount(Integer pageCount) {
        this.pageCount = pageCount;
    }

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public long getRowCount() {
        return rowCount;
    }

    public void setRowCount(long rowCount) {
        this.rowCount = rowCount;
    }

    public void setRowCount(Integer rowCount) {
        this.rowCount = rowCount;
    }

    public String getSortField() {
        return sortField;
    }

    public void setSortField(String sortField) {
        this.sortField = sortField;
    }

    public List<V> getQueryList() {
        return queryList;
    }

    public void setQueryList(List<V> queryList) {
        this.queryList = queryList;
    }

    public void convertPageToResult (Page page, V target){
        List queryList = page.getContent();
        List<V> voList = new ArrayList<>();
        queryList.forEach(queryData -> {
            try {
                V targetInstance = (V) target.getClass().newInstance();
                BeanUtils.copyProperties(queryData, targetInstance);
                voList.add(targetInstance);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });
        /**
         * TODO:set 根据 page 设置分页参数;
         */
        this.setPageSize(page.getNumberOfElements());
        this.setPageCount(page.getTotalPages());
        this.setRowCount(page.getTotalElements());
        this.setCurrentPage(page.getNumber() + 1);
        this.setQueryList(voList);
    }
}
