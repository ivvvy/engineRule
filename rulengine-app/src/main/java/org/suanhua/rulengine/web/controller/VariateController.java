package org.suanhua.rulengine.web.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.suanhua.rulengine.dao.domain.BaseVariate;
import org.suanhua.rulengine.service.data.BaseVariateDataService;
import org.suanhua.rulengine.service.data.LockService;
import org.suanhua.rulengine.vo.PageVO;
import org.suanhua.rulengine.vo.RulengineResponse;
import org.suanhua.rulengine.vo.SortParamVO;
import org.suanhua.rulengine.vo.variate.*;
import org.suanhua.rulengine.web.utils.ExcelReader;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 变量 控制层
 * 提供 增、删、查、改、检出 三个接口
 * Created by jie.qian on 2017/8/2.
 */

@Controller
@RequestMapping(value = "/rulengine/{areaType}/variate")
public class VariateController {
    /*TODO:User Model 未设定，先将 userId,orgId设为定值，等权限管理完成之后再改*/
    static String userId = "8008208820";
    static String orgId = "1008610086";
    @Autowired
    private BaseVariateDataService baseVariateDataService;
    @Autowired
    private LockService lockService;

    @RequestMapping(value = "/upload_variate")
    public
    @ResponseBody
    RulengineResponse uploadVariateInfo(@RequestParam(value = "file_upload") MultipartFile file, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        try {
            ExcelReader excelReader = new ExcelReader(file.getInputStream());
            List<Map<String, String>> variateList = excelReader.getSheetDataBySheetName("variate");
            List<BaseVariate> uploadVariateList = new ArrayList<>();
            if (variateList != null && variateList.size() > 0) {
                for (Map<String, String> variateMap : variateList) {
                    BaseVariate baseVariate = new BaseVariate();
                    baseVariate.setAreaType(areaType);
                    baseVariate.setDescription(variateMap.get("description"));
                    baseVariate.setDataType(variateMap.get("dataType"));
                    baseVariate.setVarName(variateMap.get("varName"));
                    baseVariate.setVarType(Integer.parseInt(variateMap.get("varType")));
                    baseVariate.setOrgId(orgId);
                    baseVariate.setCreater(userId);
                    baseVariate.setUpdater(userId);
                    baseVariate.setSort(variateMap.get("sort"));
                    uploadVariateList.add(baseVariate);
                }
            }
            baseVariateDataService.batchUploadVariate(uploadVariateList);
            rulengineResponse.setRetCode("00");
            rulengineResponse.setRetMsg("上传成功");
        } catch (Exception ex) {
            ex.printStackTrace();
            rulengineResponse.setRetCode("ff");
            rulengineResponse.setRetMsg("上传失败");
        }

        return rulengineResponse;
    }


    @RequestMapping(value = "/query", method = RequestMethod.POST)
    public
    @ResponseBody
    VariateQueryResp queryVariate(@RequestBody VariateQueryReq variateQueryReq, HttpSession httpSession, @PathVariable String areaType) {
        /**
         * TODO:从session中获取用户信息 httpSession.getAttribute("UserInfo");
         */
        VariateQueryResp variateQueryResp = new VariateQueryResp();
        VariateQueryParam variateQueryParam = variateQueryReq.getQueryParam() == null ? new VariateQueryParam() : variateQueryReq.getQueryParam();
        SortParamVO sortParam = variateQueryReq.getSortparam() == null ? new SortParamVO() : variateQueryReq.getSortparam();

        BaseVariate queryVariate = new BaseVariate();
        BeanUtils.copyProperties(variateQueryParam, queryVariate);

        queryVariate.setAreaType(areaType);

        //创建开始和结束时间set到createTime好updateTime;
        queryVariate.setCreateTime(variateQueryParam.getStartDate());
        queryVariate.setUpdateTime(variateQueryParam.getEndDate());

        //设置查询分页
        queryVariate.setPage(sortParam.getPageNum() == null ? 1 : sortParam.getPageNum());
        queryVariate.setRows(sortParam.getPageSize() == null ? 10 : sortParam.getPageSize());

        try {
            Page<BaseVariate> variatePage = baseVariateDataService.getVariateByAll(queryVariate);
            PageVO<VariateVO> pageVO = new PageVO<>();
            pageVO.convertPageToResult(variatePage, new VariateVO());

            variateQueryResp.setData(pageVO);
            variateQueryResp.setRetCode("00");
            variateQueryResp.setRetMsg("成功");
        } catch (Exception ex) {
            variateQueryResp.setRetCode("ff");
            variateQueryResp.setRetMsg("失败");
        }

        return variateQueryResp;
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse modifyVariate(@RequestBody VariateUpdateReq variateUpdateReq, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        BaseVariate updateData = variateUpdateReq.getUpdateData();
        /**
         * TODO:1.从Session中获取用户信息，set到updateData中
         */
        BaseVariate oldVariate = baseVariateDataService.getVariateByControlNo(updateData.getControlNo());

        updateData.setVersions(oldVariate.getVersions());
        updateData.setCreater(oldVariate.getCreater());
        updateData.setCreateTime(oldVariate.getCreateTime());
        updateData.setAreaType(areaType);
        updateData.setUpdater(userId);

        try {
            baseVariateDataService.updateVariate(updateData);
            rulengineResponse.setRetCode("00");
            rulengineResponse.setRetMsg("成功");
        } catch (Exception ex) {
            rulengineResponse.setRetCode("ff");
            rulengineResponse.setRetMsg("修改失败");
        }
        return rulengineResponse;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse addVariate(@RequestBody VariateSaveReq variateSaveReq, HttpSession httpSession, @PathVariable String areaType) {
        BaseVariate saveData = variateSaveReq.getSaveData();
        if (!baseVariateDataService.validateNameAndDesc(saveData)) {
            return new RulengineResponse() {{
                setRetMsg("变量名称或描述已存在");
                setRetCode("ff");
            }};
        }
        saveData.setAreaType(areaType);
        saveData.setCreater(userId);
        try {
            baseVariateDataService.saveVariate(saveData);
            return new RulengineResponse() {{
                setRetMsg("成功");
                setRetCode("00");
            }};
        } catch (Exception ex) {
            return new RulengineResponse() {{
                setRetMsg("新增失败");
                setRetCode("ff");
            }};
        }
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public
    @ResponseBody
    RulengineResponse delVariate(@RequestBody BaseVariate baseVariate, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        try {
            /**
             * TODO:从session中获取用户信息
             * 判断用户是否有权限删除该条记录的锁权限,若有权限则删除该条记录
             */
            BaseVariate delVariate = baseVariateDataService.getVariateByControlNo(baseVariate.getControlNo());
            if (delVariate != null && (!new Integer("1").equals(delVariate.getIsLock()) || userId.equals(delVariate.getUserId()))) {
                baseVariateDataService.deleteVariateById(delVariate.getId());
                rulengineResponse.setRetCode("00");
                rulengineResponse.setRetMsg("成功");
            } else {
                rulengineResponse.setRetCode("ff");
                rulengineResponse.setRetMsg("无权删除该条变量");
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
    RulengineResponse checkoutVariate(@RequestBody BaseVariate baseVariate, HttpSession httpSession, @PathVariable String areaType) {
        RulengineResponse rulengineResponse = new RulengineResponse();
        try {
            BaseVariate checkVariate = baseVariateDataService.getVariateByControlNo(baseVariate.getControlNo());
            if (checkVariate != null && (checkVariate.getIsLock() != 1 || userId.equals(checkVariate.getUserId()))) {
                checkVariate.setUserId(userId);
                lockService.addBaseVariateLock(checkVariate);
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

}
