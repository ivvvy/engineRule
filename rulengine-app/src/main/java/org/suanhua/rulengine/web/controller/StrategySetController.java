/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: StrategySetController.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.web.controller
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 18:42
 * @version: V1.0.0
 */

package org.suanhua.rulengine.web.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.suanhua.rulengine.dao.domain.Strategy;
import org.suanhua.rulengine.dao.domain.StrategySet;
import org.suanhua.rulengine.service.data.DroolsStrategySetService;
import org.suanhua.rulengine.service.data.LockService;
import org.suanhua.rulengine.vo.PageVO;
import org.suanhua.rulengine.vo.RulengineResponse;
import org.suanhua.rulengine.vo.SortParamVO;
import org.suanhua.rulengine.vo.strategyset.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

/**
 * 策略集 控制层
 * 提供 增、删、查、改、检出 五个接口
 *
 * @author: jie.qian
 * @date: 2017-08-14 18:42
 */
//TODO: 添加logger

@Controller
@RequestMapping(value = "/{areaType}/strategyset")
public class StrategySetController {

    /*TODO:User Model 未设定，先将 userId,orgId设为定值，等权限管理完成之后再改*/
    static String userId = "8008208820";
    static String orgId = "1008610086";

    @Autowired
    DroolsStrategySetService droolsStrategySetService;

    @Autowired
    private LockService lockService;

    @RequestMapping(value = "/query", method = RequestMethod.POST)
    public
    @ResponseBody
    StrategySetQueryResp queryStrategySet(@RequestBody StrategySetQueryReq strategySetQueryReq, HttpSession httpSession, @PathVariable String areaType) {
        StrategySetQueryResp strategySetQueryResp = new StrategySetQueryResp();
        StrategySetQueryParam strategySetQueryParam = strategySetQueryReq.getQueryParam() == null ? new StrategySetQueryParam() : strategySetQueryReq.getQueryParam();
        SortParamVO sortParam = strategySetQueryReq.getSortParam() == null ? new SortParamVO() : strategySetQueryReq.getSortParam();

        StrategySet queryStrategySet = new StrategySet();
        BeanUtils.copyProperties(strategySetQueryParam, queryStrategySet);

        queryStrategySet.setAreaType(areaType);
        queryStrategySet.setPage(sortParam.getPageNum() == null ? 1 : sortParam.getPageNum());
        queryStrategySet.setRows(sortParam.getPageSize() == null ? 10 : sortParam.getPageSize());

        try {
            Page<StrategySet> strategySetPage = droolsStrategySetService.getStrategySet(queryStrategySet);
            PageVO<StrategySetVO> pageVO = new PageVO<>();
            pageVO.convertPageToResult(strategySetPage, new StrategySetVO());

            strategySetQueryResp.setData(pageVO);
            strategySetQueryResp.setRetCode("00");
            strategySetQueryResp.setRetMsg("成功");
        } catch (Exception ex) {
            strategySetQueryResp.setRetCode("ff");
            strategySetQueryResp.setRetMsg("失败");
        }

        return strategySetQueryResp;
    }


    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse updateStrategySet(@RequestBody StrategySetUpdateReq strategySetUpdateReq, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        StrategySet updateData = strategySetUpdateReq.getUpdateData();
        List<StrategyWithRunLevel> strategyWithRunLevelList = strategySetUpdateReq.getRefInfo();

        try {
            StrategySet queryCond = new StrategySet();
            queryCond.setControlNo(updateData.getControlNo());
            List<StrategySet> oldStrategySet = droolsStrategySetService.getStrategySetByControlNo(queryCond);
            List<StrategySet> updateStrategySetData = new ArrayList<>();
            if (oldStrategySet != null && oldStrategySet.size() > 0) {
                StrategySet aOldStragegySet = oldStrategySet.get(0);
                //判断是否有权限修改
                if (!new Integer("1").equals(aOldStragegySet.getIsLock()) || userId.equals(aOldStragegySet.getUserId())) {

                    strategyWithRunLevelList.forEach(strategyWithRunLevel -> {
                        StrategySet copyStrategySet = new StrategySet();
                        copyStrategySet.setStrategySetName(aOldStragegySet.getStrategySetName());
                        copyStrategySet.setDescription(aOldStragegySet.getDescription());
                        copyStrategySet.setSort(updateData.getSort());
                        copyStrategySet.setAreaType(areaType);
                        copyStrategySet.setUpdater(userId);
                        copyStrategySet.setOrgId(orgId);
                        copyStrategySet.setCompilingStatus(updateData.getCompilingStatus());
                        copyStrategySet.setCreater(aOldStragegySet.getCreater());
                        copyStrategySet.setRunLevel(strategyWithRunLevel.getRunLevel());
                        copyStrategySet.setStrategyName(strategyWithRunLevel.getStrategyName());
                        copyStrategySet.setStrategyNo(strategyWithRunLevel.getControlNo());

                        updateStrategySetData.add(copyStrategySet);
                    });
                    droolsStrategySetService.updateStrategySet(updateStrategySetData, aOldStragegySet.getControlNo(), userId, aOldStragegySet.getVersions());
                    rulengineResponse.setRetCode("00");
                    rulengineResponse.setRetMsg("成功");
                } else {
                    rulengineResponse.setRetCode("ff");
                    rulengineResponse.setRetMsg("无权限修改");
                }
            } else {
                rulengineResponse.setRetCode("ff");
                rulengineResponse.setRetMsg("修改的策略集不存在");
            }
        } catch (Exception ex) {
            rulengineResponse.setRetCode("ff");
            rulengineResponse.setRetMsg("修改失败");
        }
        return rulengineResponse;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse addStrategySet(@RequestBody StrategySetSaveReq strategySetSaveReq, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        StrategySet saveData = strategySetSaveReq.getSaveData();
        List<StrategyWithRunLevel> strategyWithRunLevelList = strategySetSaveReq.getRefInfo();
        try {
            if (!(droolsStrategySetService.getStrategySetByName(saveData).size() > 0 || droolsStrategySetService.getStrategySetByDes(saveData).size() > 0)) {   //检测策略集名是否重复
                /**
                 * 从Session中获取用户信息，set到saveData中
                 */
                List<StrategySet> saveStrategySetData = new ArrayList<>();

                strategyWithRunLevelList.forEach(strategyWithRunLevel -> {
                    //新建一条策略集并set值
                    StrategySet copyStrategySet = new StrategySet();
                    BeanUtils.copyProperties(saveData, copyStrategySet);
                    copyStrategySet.setAreaType(areaType);
                    copyStrategySet.setCreater(userId);
                    copyStrategySet.setUpdater(userId);
                    copyStrategySet.setOrgId(orgId);
                    copyStrategySet.setRunLevel(strategyWithRunLevel.getRunLevel());
                    copyStrategySet.setStrategyName(strategyWithRunLevel.getStrategyName());
                    copyStrategySet.setStrategyNo(strategyWithRunLevel.getControlNo());

                    saveStrategySetData.add(copyStrategySet);
                });

                droolsStrategySetService.saveDroolsStrategySet(saveStrategySetData);
                rulengineResponse.setRetCode("00");
                rulengineResponse.setRetMsg("成功");
            } else {
                rulengineResponse.setRetCode("ff");
                rulengineResponse.setRetMsg("策略集名称或描述已存在");
            }
        } catch (Exception ex) {
            rulengineResponse.setRetCode("ff");
            rulengineResponse.setRetMsg("新增失败");
        }
        return rulengineResponse;
    }


    @RequestMapping(value = "/detail", method = RequestMethod.POST)
    public
    @ResponseBody
    StrategySetQueryDetailResp queryDetail(@RequestBody StrategySet strategySet, HttpSession httpSession, @PathVariable String areaType) {
        StrategySetQueryDetailResp strategySetQueryDetailResp = new StrategySetQueryDetailResp();
        StrategySetDetail strategySetDetail = new StrategySetDetail();
        try {
            //获取决策集
            strategySet.setAreaType(areaType);
            List<StrategySet> strategySetList = droolsStrategySetService.getStrategySetByControlNo(strategySet);
            if (strategySetList != null && strategySetList.size() > 0) {
                StrategySet aStrategySet = strategySetList.get(0);
                StrategySetVO strategySetVO = new StrategySetVO();
                List<StrategyWithRunLevel> strategyWithRunLevelList = new ArrayList<>();
                BeanUtils.copyProperties(aStrategySet, strategySetVO);

                List<Strategy> strategyList = droolsStrategySetService.getDetailByControlNo(strategySet);
                strategyList.forEach(strategy -> {
                    StrategyWithRunLevel strategyWithRunLevel = new StrategyWithRunLevel();
                    BeanUtils.copyProperties(strategy, strategyWithRunLevel);
                    for (StrategySet strategySetWithLevel : strategySetList) {
                        if (strategySetWithLevel.getStrategyName().equals(strategy.getStrategyName())) {
                            strategyWithRunLevel.setRunLevel(strategySetWithLevel.getRunLevel());
                            strategyWithRunLevelList.add(strategyWithRunLevel);
                            break;
                        }
                    }
                });

                strategySetDetail.setStrategys(strategyWithRunLevelList);
                strategySetDetail.setDetail(strategySetVO);

                strategySetQueryDetailResp.setData(strategySetDetail);
                strategySetQueryDetailResp.setRetCode("00");
                strategySetQueryDetailResp.setRetMsg("成功");
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            strategySetQueryDetailResp.setRetCode("ff");
            strategySetQueryDetailResp.setRetMsg("失败");
        }
        return strategySetQueryDetailResp;
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse deleteStrategySet(@RequestBody StrategySet strategySet) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        try {
            List<StrategySet> delStrategySetList = droolsStrategySetService.getStrategySetByControlNo(strategySet);

            if (delStrategySetList != null
                    && delStrategySetList.size() > 0
                    && (!new Integer("1").equals(delStrategySetList.get(0).getIsLock()) || userId.equals(delStrategySetList.get(0).getUserId()))) {
                droolsStrategySetService.deleteStrategySet(strategySet);
                rulengineResponse.setRetCode("00");
                rulengineResponse.setRetMsg("ff");
            } else {
                rulengineResponse.setRetCode("ff");
                rulengineResponse.setRetMsg("无权删除此策略集");
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
    RulengineResponse checkoutStrategySet(@RequestBody StrategySet strategySet, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        try {
            List<StrategySet> checkStrategySetList = droolsStrategySetService.getStrategySetByControlNo(strategySet);
            if (checkStrategySetList != null
                    && checkStrategySetList.size() > 0
                    && (checkStrategySetList.get(0).getIsLock() != 1 || userId.equals(checkStrategySetList.get(0).getUserId()))) {
                //TODO:从session获取用户信息
                StrategySet checkStrategySet = checkStrategySetList.get(0);
                checkStrategySet.setUserId(userId);
                lockService.addStrategySetLock(checkStrategySet);
                rulengineResponse.setRetCode("00");
                rulengineResponse.setRetMsg("检出成功");
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


}
