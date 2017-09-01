/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: DecisionFlowController.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.web.controller
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-28 9:20
 * @version: V1.0.0
 */

package org.suanhua.rulengine.web.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.suanhua.rulengine.dao.domain.DecisionFlow;
import org.suanhua.rulengine.dao.domain.ReferenceInfo;
import org.suanhua.rulengine.service.data.DecisionFlowService;
import org.suanhua.rulengine.service.data.LockService;
import org.suanhua.rulengine.vo.PageVO;
import org.suanhua.rulengine.vo.RulengineResponse;
import org.suanhua.rulengine.vo.SortParamVO;
import org.suanhua.rulengine.vo.decisionflow.*;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * @author: jie.qian
 * @date: 2017-08-28 9:20
 */
@Controller
@RequestMapping(value = "/rulengine/{areaType}/decision_flow")
public class DecisionFlowController {
    /*TODO:User Model 未设定，先将 userId,orgId设为定值，等权限管理完成之后再改*/
    static String userId = "8008208820";
    static String orgId = "1008610086";

    @Autowired
    DecisionFlowService decisionFlowService;

    @Autowired
    private LockService lockService;

    @RequestMapping(value = "/query", method = RequestMethod.POST)
    public
    @ResponseBody
    DecisionFlowQueryResp queryDecisionFlow(@RequestBody DecisionFlowQueryReq decisionFlowQueryReq, HttpSession httpSession, @PathVariable String areaType) {
        DecisionFlowQueryResp decisionFlowQueryResp = new DecisionFlowQueryResp();
        SortParamVO sortParam = decisionFlowQueryReq.getSortParam() == null ? new SortParamVO() : decisionFlowQueryReq.getSortParam();
        DecisionFlowQueryParam decisionFlowQueryParam = decisionFlowQueryReq.getQueryParam() == null ? new DecisionFlowQueryParam() : decisionFlowQueryReq.getQueryParam();

        DecisionFlow queryDecisionFlow = new DecisionFlow();
        BeanUtils.copyProperties(decisionFlowQueryParam, queryDecisionFlow);

        queryDecisionFlow.setAreaType(areaType);
        queryDecisionFlow.setPage(sortParam.getPageNum() == null ? 1 : sortParam.getPageNum());
        queryDecisionFlow.setRows(sortParam.getPageSize() == null ? 10 : sortParam.getPageSize());
        try {
            Page<DecisionFlow> decisionFlowPage = decisionFlowService.findByconds(queryDecisionFlow);
            PageVO<DecisionFlow> pageVO = new PageVO<>();
            pageVO.convertPageToResult(decisionFlowPage, new DecisionFlow());

            decisionFlowQueryResp.setData(pageVO);
            decisionFlowQueryResp.setRetCode("00");
            decisionFlowQueryResp.setRetMsg("成功");
        } catch (Exception ex) {
            decisionFlowQueryResp.setRetCode("ff");
            decisionFlowQueryResp.setRetMsg("失败");
        }
        return decisionFlowQueryResp;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse addDecisionFlow(@RequestBody DecisionFlowSaveReq decisionFlowSaveReq, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        DecisionFlow saveData = decisionFlowSaveReq.getSaveData();
        List<ReferenceInfo> referenceInfoList = decisionFlowSaveReq.getRefInfo();

        if (decisionFlowService.findFlowByDec(saveData.getDescription(), areaType).size() > 0 || decisionFlowService.findFlowByName(saveData.getDflowName(), areaType).size() > 0) {
            return new RulengineResponse() {{
                setRetMsg("决策流名称或描述已存在");
                setRetCode("ff");
            }};
        }
        saveData.setAreaType(areaType);
        saveData.setUpdater(userId);
        saveData.setCreater(userId);
        saveData.setOrgId(userId);

        try {
            decisionFlowService.saveDecisionFlow(saveData, referenceInfoList);
            rulengineResponse.setRetCode("00");
            rulengineResponse.setRetMsg("成功");
        } catch (Exception ex) {
            rulengineResponse.setRetCode("ff");
            rulengineResponse.setRetMsg("失败");
        }
        return rulengineResponse;
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse updateDecisionFlow(@RequestBody DecisionFlowUpdateReq decisionFlowUpdateReq, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        DecisionFlow updateData = decisionFlowUpdateReq.getUpdateData();
        List<ReferenceInfo> referenceInfoList = decisionFlowUpdateReq.getRefInfo();

        referenceInfoList.forEach(referenceInfo -> {
            referenceInfo.setCreater(userId);
        });
        List<DecisionFlow> oldDecisionFlowList = decisionFlowService.findFlowByNo(updateData.getControlNo(), areaType);
        if (decisionFlowService.findFlowByNo(updateData.getControlNo(), areaType).size() > 0) {
            DecisionFlow oldDecisionFlow = oldDecisionFlowList.get(0);

            updateData.setVersions(oldDecisionFlow.getVersions());
            updateData.setAreaType(areaType);
            updateData.setUpdater(userId);
            updateData.setOrgId(orgId);

            try {
                decisionFlowService.updateDecisionFlow(updateData, referenceInfoList);
                rulengineResponse.setRetCode("00");
                rulengineResponse.setRetMsg("成功");
            } catch (Exception e) {
                rulengineResponse.setRetCode("ff");
                rulengineResponse.setRetMsg("修改失败");
            }
        } else {
            rulengineResponse.setRetCode("ff");
            rulengineResponse.setRetMsg("该条决策流不存在,请确认后重试");
        }

        return rulengineResponse;
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse deleteDecisionFlow(@RequestBody DecisionFlow decisionFlow, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        try {
            List<DecisionFlow> oldDecisionFlowList = decisionFlowService.findFlowByNo(decisionFlow.getControlNo(), areaType);
            if (oldDecisionFlowList != null && oldDecisionFlowList.size() > 0) {
                DecisionFlow delDecisionFlow = oldDecisionFlowList.get(0);
                if (delDecisionFlow != null && (delDecisionFlow.getIsLock() == 0 || userId.equals(delDecisionFlow.getUserId()))) {
                    decisionFlowService.deleteDecisionFlow(delDecisionFlow);
                    rulengineResponse.setRetCode("00");
                    rulengineResponse.setRetMsg("成功");
                } else {
                    rulengineResponse.setRetCode("ff");
                    rulengineResponse.setRetMsg("删除失败");
                }
            } else {
                rulengineResponse.setRetCode("ff");
                rulengineResponse.setRetMsg("该条决策流不存在，请确认后重试");
            }
        } catch (Exception ex) {
            rulengineResponse.setRetCode("ff");
            rulengineResponse.setRetMsg("删除失败");
        }
        return rulengineResponse;
    }

    @RequestMapping(value = "/checkout", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse checkoutDecisionFlow(@RequestBody DecisionFlow decisionFlow, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        try {
            List<DecisionFlow> oldDecisionFlowList = decisionFlowService.findFlowByNo(decisionFlow.getControlNo(), areaType);
            if (oldDecisionFlowList != null && oldDecisionFlowList.size() > 0) {
                DecisionFlow checkDecisionFlow = oldDecisionFlowList.get(0);
                if (checkDecisionFlow != null && (!new Integer("1").equals(checkDecisionFlow.getIsLock()) || userId.equals(checkDecisionFlow.getUserId()))) {
                    lockService.addDecisionFlowLock(userId, checkDecisionFlow.getControlNo());
                    rulengineResponse.setRetCode("00");
                    rulengineResponse.setRetMsg("成功");
                } else {
                    rulengineResponse.setRetCode("ff");
                    rulengineResponse.setRetMsg("无权修改该条决策流");
                }
            } else {
                rulengineResponse.setRetCode("ff");
                rulengineResponse.setRetMsg("该条决策流不存在,请确认后重试");
            }
        } catch (Exception ex) {
            rulengineResponse.setRetCode("ff");
            rulengineResponse.setRetMsg("检出失败");
        }
        return rulengineResponse;
    }

    @RequestMapping(value = "/detail", method = RequestMethod.POST)
    public
    @ResponseBody
    DecisionFlowDetailResp getDecisionFlowDetail(@RequestBody DecisionFlow queryDecisionFlow, HttpSession httpSession, @PathVariable String areaType) {
        DecisionFlowDetailResp strategyDetailResp = new DecisionFlowDetailResp();
        try {
            List<DecisionFlow> decisionFlowList = decisionFlowService.findFlowByNo(queryDecisionFlow.getControlNo(), areaType);

            if (decisionFlowList != null && decisionFlowList.size() > 0) {
                DecisionFlow aDecisionFlow = decisionFlowList.get(0);
                DecisionFlowVO decisionFlowVO = new DecisionFlowVO();
                BeanUtils.copyProperties(aDecisionFlow, decisionFlowVO);

                strategyDetailResp.setData(decisionFlowVO);
                strategyDetailResp.setRetCode("00");
                strategyDetailResp.setRetMsg("成功");
            } else {
                strategyDetailResp.setRetCode("ff");
                strategyDetailResp.setRetMsg("失败");
            }
        } catch (Exception ex) {
            strategyDetailResp.setRetCode("ff");
            strategyDetailResp.setRetMsg("失败");
        }
        return strategyDetailResp;
    }
}
