/**
 * Copyright © 2017算话征信. All rights reserved.
 *
 * @Title: BaseTast.java
 * @Prject: rulengine-app
 * @Package: org.suanhua.rulengine.test
 * @Description: TODO
 * @author: jie.qian
 * @date: 2017-08-21 8:39
 * @version: V1.0.0
 */

package org.suanhua.rulengine.test;

import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

/**
 * @author: jie.qian
 * @date: 2017-08-21 8:39  
 */

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"classpath:spring/application-Context.xml","classpath:spring/dispatcher-servlet.xml","classpath:spring/application-jpa.xml","classpath:spring/application-service.xml"})

public class BaseTast {

}
