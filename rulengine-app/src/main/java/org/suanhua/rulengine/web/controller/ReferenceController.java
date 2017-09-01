/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: ReferenceController.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.web.controller
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-14 18:52
 * @version: V1.0.0
 */

package org.suanhua.rulengine.web.controller;


import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.suanhua.rulengine.dao.domain.ReferenceInfo;
import org.suanhua.rulengine.service.data.ReferenceInfoService;
import org.suanhua.rulengine.vo.reference.ReferenceQueryResp;
import org.suanhua.rulengine.vo.reference.ReferenceQueryResult;
import org.suanhua.rulengine.vo.reference.ReferenceVO;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 查看引用 控制层
 * @author: jie.qian
 * @date: 2017-08-14 18:52  
 */
@Controller
@RequestMapping(value = "/rulengine/{areaType}/reference")
public class ReferenceController {
    @Autowired
    ReferenceInfoService referenceInfoService;

    @RequestMapping(value = {"/query"},method = RequestMethod.POST)
    public
    @ResponseBody
    ReferenceQueryResp QueryVariate(@RequestBody ReferenceInfo referenceInfo){
        ReferenceQueryResp referenceQueryResp = new ReferenceQueryResp();
        ReferenceQueryResult referenceQueryResult = new ReferenceQueryResult();

        try{
            Map<String, List<ReferenceInfo>> referenceInfoMap = referenceInfoService.getReferenceinfo(referenceInfo.getRefvarNum());

            List<ReferenceVO> beRefVoList = new ArrayList<>();
            referenceInfoMap.get("beRefInfo").forEach(beRefInfo -> {
                ReferenceVO referenceVO = new ReferenceVO();
                BeanUtils.copyProperties(beRefInfo, referenceVO);
                beRefVoList.add(referenceVO);
            });
            referenceQueryResult.setBeRefInfo(beRefVoList);
            List<ReferenceVO> refVoList = new ArrayList<>();
            referenceInfoMap.get("refInfo").forEach(refInfo -> {
                ReferenceVO referenceVO = new ReferenceVO();
                BeanUtils.copyProperties(refInfo,referenceVO);
                refVoList.add(referenceVO);
            });
            referenceQueryResult.setRefInfo(refVoList);
            referenceQueryResp.setData(referenceQueryResult);
            referenceQueryResp.setRetCode("00");
            referenceQueryResp.setRetMsg("成功");
        } catch (Exception ex) {
            referenceQueryResp.setRetCode("ff");
            referenceQueryResp.setRetMsg("失败");
        }

        return referenceQueryResp;
    }
}
