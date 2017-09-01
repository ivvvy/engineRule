/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: ExcelReader.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.web.utils
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-23 11:45
 * @version: V1.0.0
 */

package org.suanhua.rulengine.web.utils;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.ss.usermodel.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @author: jie.qian
 * @date: 2017-08-23 11:45
 */
public class ExcelReader {
    private InputStream inputStream;
    private Workbook workbook;
    private List<String> sheetNameList;
    private Map<String, Sheet> sheetMap;
    private Map<String, List<String>> colHeaderMap;
    private Map<String, List<Map<String, String>>> allSheetData;

    public ExcelReader(InputStream inputStream) throws Exception {
        this.inputStream = inputStream;
        load();
        readSheetData();
    }

    //TODO: ExcelReaderException
    private void load() throws Exception {
        try {
            workbook = WorkbookFactory.create(inputStream);
            sheetNameList = sheetNameList == null ? new ArrayList<>() : sheetNameList;
            sheetMap = sheetMap == null ? new LinkedHashMap<>() : sheetMap;
            colHeaderMap = colHeaderMap == null ? new LinkedHashMap<>() : colHeaderMap;

            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                String sheetName = workbook.getSheetName(i);
                sheetNameList.add(sheetName);
                sheetMap.put(sheetName, workbook.getSheetAt(i));
            }
        } catch (Exception ex) {
            throw new Exception(ex);
        } finally {
            try {
                if (inputStream != null)
                    inputStream.close();
            } catch (IOException ex) {
                throw new Exception(ex);
            }
        }
    }

    private String getCellValue(Cell cell) {
        String cellValue = "";
        if (cell != null) {
            switch (cell.getCellType()) {
                case Cell.CELL_TYPE_NUMERIC:
                    cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                case Cell.CELL_TYPE_STRING:
                    cellValue = cell.getStringCellValue();
                    break;
                case Cell.CELL_TYPE_BOOLEAN:
                    cellValue = String.valueOf(cell.getBooleanCellValue());
                    break;
                case Cell.CELL_TYPE_FORMULA:
                    cellValue = String.valueOf(cell.getCellFormula());
                    break;
                case Cell.CELL_TYPE_BLANK:
                    cellValue = "";
                    break;
                case Cell.CELL_TYPE_ERROR:
                    cellValue = "";
                    break;
                default:
                    cellValue = cell.toString().trim();
                    break;
            }
        }
        return cellValue.trim();
    }

    private void readSheetData() {
        if (allSheetData == null) {
            allSheetData = new LinkedHashMap<>();
        }
        for (String sheetName : sheetNameList) {
            Sheet sheet = sheetMap.get(sheetName);
            int numOfRows = sheet.getLastRowNum();

            List<List<String>> listData = new ArrayList<>();                //每个sheet中的数据
            List<Map<String, String>> sheetDataList = new ArrayList<>();
            List<String> colHeaderList = new ArrayList<>();

            /**/
            Row firstRow = sheet.getRow(0);
            int firstCellNum = firstRow.getLastCellNum();//总列数

            for (int j = 0; j < firstCellNum; j++) {
                colHeaderList.add(getCellValue(firstRow.getCell(j)));
            }

            colHeaderMap.put(sheetName, colHeaderList);

            for (int i = 1; i <= numOfRows; i++) {
                Row row = sheet.getRow(i);
                Map<String, String> map = new LinkedHashMap<>();
                List<String> list = new ArrayList<>();
                if (row != null) {
                    for (int j = 0; j < firstCellNum; j++) {
                        Cell cell = row.getCell(j);
                        String value = getCellValue(cell);
                        map.put(colHeaderList.get(j), value);
                        list.add(value);
                    }
                    sheetDataList.add(map);

                    listData.add(list);
                }
            }
            allSheetData.put(sheetName, sheetDataList);
        }
    }

    public List<String> getSheetNameList() {
        return sheetNameList;
    }

    public Map<String, List<Map<String, String>>> getAllSheetData() {
        return allSheetData;
    }

    public List<Map<String, String>> getSheetDataBySheetName(String sheetName){
        return allSheetData.get(sheetName);
    }

}
