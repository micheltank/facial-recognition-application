package br.com.furb.facialrecognition.microservice.web.rest;

import java.io.ByteArrayInputStream;
import java.util.Base64;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.furb.facialrecognition.microservice.service.CompareFaceService;
import br.com.furb.facialrecognition.microservice.service.FaceService;
import br.com.furb.facialrecognition.microservice.service.FileUploaderService;

@RestController
@RequestMapping("/api")
public class FacialRecognitionResource {

	@PostMapping("/facial-recognition-compare")
	public String facialRecognition(@RequestBody FacialRecognitionDTO facialRecognition) throws Exception {
		String imageUrl = null;
		if (facialRecognition.getImageValue() != null) {
			byte[] imageByteArray = Base64.getDecoder().decode(facialRecognition.getImageValue());
			ByteArrayInputStream imageStream = new ByteArrayInputStream(imageByteArray);
			try {
				imageUrl = FileUploaderService.upload(facialRecognition.getUsername().concat("compare"), imageStream);
			} catch (Exception e1) {
				System.out.println(e1.getMessage());
			}
		}
		String faceIdUploaded = FaceService.uploadImage(imageUrl);
		Boolean equals = CompareFaceService.compare(faceIdUploaded, facialRecognition.getFaceId());
		return equals.toString();
	}
	
	@PostMapping("/generate-face-id")
	public String generateFaceId(@RequestBody String imageUrl) throws Exception {
		return FaceService.uploadImage(imageUrl);
	}
}
