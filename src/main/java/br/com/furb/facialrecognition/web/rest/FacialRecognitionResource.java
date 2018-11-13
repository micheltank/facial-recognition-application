package br.com.furb.facialrecognition.web.rest;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.furb.facialrecognition.CompareFaceService;
import br.com.furb.facialrecognition.FaceService;
import br.com.furb.facialrecognition.domain.User;
import br.com.furb.facialrecognition.repository.UserRepository;
import br.com.furb.facialrecognition.web.rest.vm.FacialRecognitionVM;

@RestController
@RequestMapping("/api")
public class FacialRecognitionResource {

	@Autowired
	private UserRepository userRepository;
	
    @PostMapping("/facial-recognition")
    public String facialRecognition(@RequestBody FacialRecognitionVM facialRecognition) throws Exception {
    	String faceIdUploaded = FaceService.uploadImage(facialRecognition.getUrlImage());
    	Optional<User> user = userRepository.findOneByLogin(facialRecognition.getUsername());
    	if (user.isPresent()) {
    		String faceIdUser = user.get().getFaceId();
    		Boolean equals = CompareFaceService.compare(faceIdUploaded, faceIdUser);
        	return equals.toString();	 
    	} else {
    		throw new Exception("User not exists");
    	}    	
    }
}
