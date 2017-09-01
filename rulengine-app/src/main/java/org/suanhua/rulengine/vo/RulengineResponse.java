package org.suanhua.rulengine.vo;

/**
 * Created by jie.qian on 2017/8/1.
 *
 * 所有接口返回的response都继承自该接口
 */
/**/
public class RulengineResponse {
    private String retCode;
    private String retMsg;

    public String getRetCode() {
        return retCode;
    }

    public void setRetCode(String retCode) {
        this.retCode = retCode;
    }

    public String getRetMsg() {
        return retMsg;
    }

    public void setRetMsg(String retMsg) {
        this.retMsg = retMsg;
    }
}
