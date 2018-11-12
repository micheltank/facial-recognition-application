package br.com.furb.facialrecognition.web.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

@RestController
@RequestMapping("/api")
public class FacialRecognitionResource {

    @GetMapping("/facial-recognition")
    @Timed
    public void activateAccount(@RequestParam(value = "username") String username, 
    		@RequestParam(value = "url-image") String urlImage) {
    	System.out.println(username);
    	System.out.println(urlImage);
    }
}
