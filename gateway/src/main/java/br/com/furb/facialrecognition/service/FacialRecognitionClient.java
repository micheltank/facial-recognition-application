package br.com.furb.facialrecognition.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import br.com.furb.facialrecognition.web.rest.FacialRecognitionDTO;

@FeignClient(name = "facialRecognitionMicroservice")
public interface FacialRecognitionClient {
  
	@RequestMapping(method = RequestMethod.POST, path = "/api/facial-recognition-compare")
	String facialRecognitionCompare(@RequestBody FacialRecognitionDTO facialRecognitionDTO);
  
	@RequestMapping(method = RequestMethod.POST, path = "/api/generate-face-id")
	String generateFaceId(String imageUrl);
}