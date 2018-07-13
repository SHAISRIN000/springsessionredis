package com.mkyong.common.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

public class HelloWorldController extends AbstractController {

	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		ModelAndView model = new ModelAndView("HelloWorldPage");
		model.addObject("msg", "hello world");
		System.out.println(request.getSession().getId());
		request.getSession().invalidate();
		System.out.println("Cleared the log:");
		request.getSession(true);
		//request.getSession().invalidate();
		//HttpSession session=request.getSession(true);
		//System.out.println("The sessionId"+session.getId());
		if(request.getSession().getAttribute("attributeName")!=null){
			int val=Integer.parseInt(request.getSession().getAttribute("attributeName").toString()) ;
			
			request.getSession().setAttribute("attributeName",val+1);
			
		}
		else
			request.getSession().setAttribute("attributeName",0);
		
			model.addObject("attributeValue", request.getSession().getAttribute("attributeName"));
		//add attribute in HttpSession
		return model;
	}

}