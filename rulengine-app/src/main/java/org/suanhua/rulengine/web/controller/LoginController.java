/**
 * Copyright © 2017算话征信. All rights reserved.
 * 
 * @Title: LoginController.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.web.controller
 * @Description: TODO
 * @author: yutao.gao
 * @date: 2017年8月16日 下午6:48:22
 * @version: V1.0.0
 */
package org.suanhua.rulengine.web.controller;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 
 * <p></p>
 * <pre></pre>
 * @author: yutao.gao
 * @date: 2017年8月16日 下午6:48:22
 * @version: V1.0.0
 */
@Controller
public class LoginController {

	private static Logger logger = LoggerFactory
			.getLogger(LoginController.class);
	
	@RequestMapping(value = "/login", method = { RequestMethod.GET,
			RequestMethod.POST })
	public String toChannelListPage(HttpServletRequest request, Model model) {
		
		logger.info("执行了登录");
		
		return "moncheck";
	}
	
}
