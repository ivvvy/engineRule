/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategyController.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.web.controller
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 18:27
 * @version: V1.0.0
 */

package org.suanhua.rulengine.web.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.suanhua.rulengine.dao.domain.ReferenceInfo;
import org.suanhua.rulengine.dao.domain.Strategy;
import org.suanhua.rulengine.service.data.DroosStrategyService;
import org.suanhua.rulengine.service.data.LockService;
import org.suanhua.rulengine.vo.PageVO;
import org.suanhua.rulengine.vo.RulengineResponse;
import org.suanhua.rulengine.vo.SortParamVO;
import org.suanhua.rulengine.vo.strategy.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

/**
 * 策略 控制层
 * 提供 增、删、查、改、检出 五个接口
 *
 * @author: jie.qian
 * @date: 2017-08-14 18:27
 */

@Controller
@RequestMapping(value = "/rulengine/{areaType}/strategy")
public class StrategyController {

    /*TODO:User Model 未设定，先将 userId,orgId设为定值，等权限管理完成之后再改*/
    static String userId = "8008208820";
    static String orgId = "1008610086";

    @Autowired
    private DroosStrategyService droosStrategyService;

    @Autowired
    private LockService lockService;


    @RequestMapping(value = "/query", method = RequestMethod.POST)
    public
    @ResponseBody
    StrategyQueryResp queryStrategy(@RequestBody StrategyQueryReq strategyQueryReq, HttpSession httpSession, @PathVariable String areaType) {
        /**
         * TODO:从session中获取用户信息 httpSession.getAttribute("UserInfo");
         */
        StrategyQueryResp strategyQueryResp = new StrategyQueryResp();
        StrategyQueryParam strategyQueryParam = strategyQueryReq.getQueryParam() == null ? new StrategyQueryParam() : strategyQueryReq.getQueryParam();
        SortParamVO sortParam = strategyQueryReq.getSortParam() == null ? new SortParamVO() : strategyQueryReq.getSortParam();

        Strategy queryStrategy = new Strategy();
        BeanUtils.copyProperties(strategyQueryParam, queryStrategy);

        queryStrategy.setAreaType(areaType);
        queryStrategy.setCreateTime(strategyQueryParam.getStartDate());
        queryStrategy.setUpdateTime(strategyQueryParam.getEndDate());

        queryStrategy.setPage(sortParam.getPageNum() == null ? 1 : sortParam.getPageNum());
        queryStrategy.setRows(sortParam.getPageSize() == null ? 10 : sortParam.getPageSize());
        try {
            Page<Strategy> strategyPage = droosStrategyService.getStrategyByAll(queryStrategy);
            PageVO<StrategyVO> pageVO = new PageVO<>();
            pageVO.convertPageToResult(strategyPage, new StrategyVO());

            strategyQueryResp.setData(pageVO);
            strategyQueryResp.setRetCode("00");
            strategyQueryResp.setRetMsg("成功");
        } catch (Exception e) {
            strategyQueryResp.setRetCode("ff");
            strategyQueryResp.setRetMsg("失败");
        }
        return strategyQueryResp;
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse updateStrategy(@RequestBody StrategyUpdateReq strategyUpdateReq, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        Strategy updateData = strategyUpdateReq.getUpdateData();
        List<ReferenceInfo> referenceInfoList = strategyUpdateReq.getRefInfo() == null ? new ArrayList<>() : strategyUpdateReq.getRefInfo();
        /**
         * 1.从Session中获取用户信息，set到updateData中
         */
        try {
            Strategy oldStragegy = droosStrategyService.getStrategyByControlNo(updateData.getControlNo());//先获取库中该条策略,判断存在后set其他属性.

            if (oldStragegy != null){
//                updateData.setId(oldStragegy.getId());
                updateData.setVersions(oldStragegy.getVersions());
                updateData.setAreaType(areaType);
                updateData.setUpdater(userId);
                updateData.setOrgId(orgId);
                updateData.setCreateTime(oldStragegy.getCreateTime());
                referenceInfoList.forEach(referenceInfo -> {
                    referenceInfo.setCreater(userId);
                    referenceInfo.setRefTypeName(updateData.getStrategyType());
                    referenceInfo.setRefvarName(updateData.getStrategyName());
                });

                droosStrategyService.updateStrategy(updateData, referenceInfoList);
                rulengineResponse.setRetCode("00");
                rulengineResponse.setRetMsg("成功");
            } else {
                rulengineResponse.setRetCode("ff");
                rulengineResponse.setRetMsg("该条策略不存在,请确认后重试");
            }
        } catch (Exception e) {
            rulengineResponse.setRetCode("ff");
            rulengineResponse.setRetMsg("修改失败");
        }

        return rulengineResponse;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse addStragegy(@RequestBody StrategySaveReq strategySaveReq, HttpSession httpSession, @PathVariable String areaType) {
        Strategy saveData = strategySaveReq.getSaveData();
        List<ReferenceInfo> referenceInfoList = strategySaveReq.getRefInfo();
        /**
         * 从Session中获取用户信息，set到updateData中
         */
        if (droosStrategyService.getDroolsStrategyByName(saveData).size() > 0 || droosStrategyService.getDroolsStrategyByDec(saveData).size() > 0) {
            return new RulengineResponse() {{
                setRetMsg("策略名称或描述已存在");
                setRetCode("ff");
            }};
        }
        saveData.setAreaType(areaType);
        saveData.setUpdater(userId);
        saveData.setCreater(userId);
        saveData.setOrgId(orgId);
        referenceInfoList.forEach(referenceInfo -> {
            referenceInfo.setCreater(userId);
            referenceInfo.setRefTypeName(saveData.getStrategyType());
            referenceInfo.setRefvarName(saveData.getStrategyName());
        });
        try {
            droosStrategyService.saveDroolStrategy(saveData, referenceInfoList);
            return new RulengineResponse() {{
                setRetMsg("成功");
                setRetCode("00");
            }};
        } catch (Exception e) {
            return new RulengineResponse() {{
                setRetMsg("新增失败");
                setRetCode("ff");
            }};
        }
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse delStragegy(@RequestBody Strategy strategy) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        try {
            /**
             * TODO:从session中获取用户信息
             * 判断用户是否有权限删除该条记录的锁权限,若有权限则删除该条记录
             */
            Strategy delStrategy = droosStrategyService.getStrategyByControlNo(strategy.getControlNo());
            if (delStrategy != null && (!new Integer("1").equals(delStrategy.getIsLock()) || userId.equals(delStrategy.getUserId()))) {
                droosStrategyService.deleteStrategy(delStrategy);
                rulengineResponse.setRetCode("00");
                rulengineResponse.setRetMsg("成功");
            } else {
                rulengineResponse.setRetCode("ff");
                rulengineResponse.setRetMsg("");
            }
        } catch (Exception ex) {
            rulengineResponse.setRetCode("ff");
            rulengineResponse.setRetMsg("");
        }
        return rulengineResponse;
    }

    @RequestMapping(value = "/checkout", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse checkoutStragegy(@RequestBody Strategy strategy) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        try {
            Strategy checkStragegy = droosStrategyService.getStrategyByControlNo(strategy.getControlNo());
            /**
             * TODO:从session中获取当前用户
             * 判断用户是否有锁权限，若用户有权限则，则修改该条记录锁状态
             */
            if (checkStragegy != null && (checkStragegy.getIsLock() != 1 || userId.equals(checkStragegy.getUserId()))) {
                lockService.addStrategyLock(userId, checkStragegy.getControlNo());
                rulengineResponse.setRetCode("00");
                rulengineResponse.setRetMsg("成功");
            } else {
                rulengineResponse.setRetCode("ff");
                rulengineResponse.setRetMsg("");
            }
        } catch (Exception ex) {
            rulengineResponse.setRetCode("ff");
            rulengineResponse.setRetMsg("");
        }
        return rulengineResponse;
    }

    @RequestMapping(value = "/detail", method = RequestMethod.POST)
    public
    @ResponseBody
    StrategyDetailResp getStrategyDetail(@RequestBody Strategy queryStrategy) {
        StrategyDetailResp strategyDetailResp = new StrategyDetailResp();
        try {
            Strategy strategy = droosStrategyService.getStrategyByControlNo(queryStrategy.getControlNo());
            StrategyVO strategyVO = new StrategyVO();

            BeanUtils.copyProperties(strategy, strategyVO);

            strategyDetailResp.setData(strategyVO);
            strategyDetailResp.setRetCode("00");
            strategyDetailResp.setRetMsg("成功");
        } catch (Exception ex) {
            strategyDetailResp.setRetCode("ff");
            strategyDetailResp.setRetMsg("失败");
        }
        return strategyDetailResp;
    }

}
