/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: FuzzyMatchController.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.web.controller
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-29 9:25
 * @version: V1.0.0
 */

package org.suanhua.rulengine.web.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.suanhua.rulengine.dao.domain.BaseVariate;
import org.suanhua.rulengine.dao.domain.Strategy;
import org.suanhua.rulengine.dao.domain.StrategySet;
import org.suanhua.rulengine.service.data.BaseVariateDataService;
import org.suanhua.rulengine.service.data.DroolsStrategySetService;
import org.suanhua.rulengine.service.data.DroosStrategyService;
import org.suanhua.rulengine.vo.fuzzymatch.FuzzyMatchResp;
import org.suanhua.rulengine.vo.strategy.StrategyVO;
import org.suanhua.rulengine.vo.strategyset.StrategySetVO;
import org.suanhua.rulengine.vo.variate.VariateVO;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

/**
 * 变量
 *
 * @author: jie.qian
 * @date: 2017-08-29 9:25
 */

@Controller
@RequestMapping(value = "/rulengine/{areaType}")
public class FuzzyMatchController {
    /*TODO:User Model 未设定，先将 userId,orgId设为定值，等权限管理完成之后再改*/
    static String userId = "8008208820";
    static String orgId = "1008610086";

    @Autowired
    private BaseVariateDataService baseVariateDataService;

    @Autowired
    private DroosStrategyService droosStrategyService;

    @Autowired
    private DroolsStrategySetService droolsStrategySetService;

    @RequestMapping(value = "/variate/fuzzy_match")
    public
    @ResponseBody
    FuzzyMatchResp<VariateVO> variateFuzzyMatch(@RequestParam(value = "queryStr") String queryStr, HttpSession httpSession, @PathVariable String areaType) {
        FuzzyMatchResp<VariateVO> variateFuzzyMatchResp = new FuzzyMatchResp<>();

        //设置查询参数
        BaseVariate queryVariate = new BaseVariate();
        queryVariate.setVarName(queryStr);
        queryVariate.setDescription(queryStr);
        queryVariate.setOrgId(orgId);
        queryVariate.setAreaType(areaType);

        List<VariateVO> variateVOList = new ArrayList<>();

        try {
            baseVariateDataService.getVariateByKeyWord(queryVariate).getContent().forEach(variate -> {
                VariateVO variateVO = new VariateVO();
                BeanUtils.copyProperties(variate, variateVO);
                variateVOList.add(variateVO);
            });
            variateFuzzyMatchResp.setData(variateVOList);
            variateFuzzyMatchResp.setRetCode("00");
            variateFuzzyMatchResp.setRetMsg("成功");
        } catch (Exception ex) {
            variateFuzzyMatchResp.setRetCode("00");
            variateFuzzyMatchResp.setRetMsg("失败");
        }

        return variateFuzzyMatchResp;
    }


    @RequestMapping(value = "/strategy/fuzzy_match")
    public
    @ResponseBody
    FuzzyMatchResp<StrategyVO> strategyFuzzyMatch(Strategy queryStrategy, HttpSession httpSession, @PathVariable String areaType) {
        FuzzyMatchResp<StrategyVO> strategyFuzzyMatchResp = new FuzzyMatchResp<>();

        //设置查询条件

        Strategy fuzzyStrategy = new Strategy();
        fuzzyStrategy.setDescription(queryStrategy.getStrategyName());
        fuzzyStrategy.setStrategyName(queryStrategy.getStrategyName());
        fuzzyStrategy.setStrategyType(queryStrategy.getStrategyType());
        fuzzyStrategy.setOrgId(orgId);
        fuzzyStrategy.setAreaType(areaType);

        List<StrategyVO> strategyVOList = new ArrayList<>();

        try {
            droosStrategyService.getStrategyByKeyWord(fuzzyStrategy).getContent().forEach(strategy -> {
                StrategyVO strategyVO = new StrategyVO();
                BeanUtils.copyProperties(strategy, strategyVO);
                strategyVOList.add(strategyVO);
            });

            strategyFuzzyMatchResp.setData(strategyVOList);
            strategyFuzzyMatchResp.setRetCode("00");
            strategyFuzzyMatchResp.setRetMsg("成功");
        } catch (Exception ex) {
            strategyFuzzyMatchResp.setRetCode("00");
            strategyFuzzyMatchResp.setRetMsg("失败");
        }

        return strategyFuzzyMatchResp;
    }

    @RequestMapping(value = "/strategyset/fuzzy_match")
    public
    @ResponseBody
    FuzzyMatchResp<StrategySetVO> strategySetFuzzyMatch(@RequestParam(value = "queryStr") String queryStr, HttpSession httpSession, @PathVariable String areaType) {
        FuzzyMatchResp<StrategySetVO> strategySetFuzzyMatchResp = new FuzzyMatchResp<>();

        //设置查询条件
        StrategySet queryStrategySet = new StrategySet();
        queryStrategySet.setDescription(queryStr);
        queryStrategySet.setStrategySetName(queryStr);
        queryStrategySet.setOrgId(orgId);
        queryStrategySet.setAreaType(areaType);

        List<StrategySetVO> strategySetVOList = new ArrayList<>();

        try {
            droolsStrategySetService.findSetByKeyWord(queryStrategySet).getContent().forEach(strategySet -> {
                StrategySetVO strategySetVO = new StrategySetVO();
                BeanUtils.copyProperties(strategySet, strategySetVO);
                strategySetVOList.add(strategySetVO);
            });
            strategySetFuzzyMatchResp.setData(strategySetVOList);
            strategySetFuzzyMatchResp.setRetCode("00");
            strategySetFuzzyMatchResp.setRetMsg("成功");

        } catch (Exception ex) {
            strategySetFuzzyMatchResp.setRetCode("ff");
            strategySetFuzzyMatchResp.setRetMsg("失败");
        }

        return strategySetFuzzyMatchResp;
    }
}
