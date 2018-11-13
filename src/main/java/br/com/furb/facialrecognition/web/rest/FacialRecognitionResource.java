package br.com.furb.facialrecognition.web.rest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import br.com.furb.facialrecognition.CompareFaceService;
import br.com.furb.facialrecognition.FaceService;
import br.com.furb.facialrecognition.web.rest.vm.FacialRecognitionVM;

@RestController
@RequestMapping("/api")
public class FacialRecognitionResource {

	private String faceIdUser = "6b35e56b-db2d-411c-9d7f-7b076048391c";
	
    @PostMapping("/facial-recognition")
    @Timed
    public String facialRecognition(@RequestBody FacialRecognitionVM facialRecognition) throws Exception {
    	String faceIdUploaded = FaceService.uploadImage(facialRecognition.getUrlImage());
    	Boolean equals = CompareFaceService.compare(faceIdUploaded, faceIdUser);
    	return equals.toString();
    }
}
