package org.suanhua.rulengine.vo;

/**
 * 分页排序参数Model
 * Created by jie.qian on 2017/8/1.
 */

public class SortParamVO {
    private Integer pageNum;     //查询页码
    private Integer pageSize;    //每页大小
    private String sortField;   //排序字段
    private String order;       //正反序

    public SortParamVO() {
        this.pageNum = 1;
        this.pageSize = 10;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public String getSortField() {
        return sortField;
    }

    public void setSortField(String sortField) {
        this.sortField = sortField;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }
}
