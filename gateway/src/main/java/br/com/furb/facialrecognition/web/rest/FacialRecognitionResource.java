package br.com.furb.facialrecognition.web.rest;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.furb.facialrecognition.domain.User;
import br.com.furb.facialrecognition.repository.UserRepository;
import br.com.furb.facialrecognition.service.FacialRecognitionClient;
import br.com.furb.facialrecognition.web.rest.vm.FacialRecognitionVM;

@RestController
@RequestMapping("/api")
public class FacialRecognitionResource {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private FacialRecognitionClient facialRecognitionClient;
	
    @PostMapping("/facial-recognition")
    public String facialRecognition(@RequestBody FacialRecognitionVM facialRecognition) throws Exception {
    	Optional<User> user = userRepository.findOneByLogin(facialRecognition.getUsername());
    	if (!user.isPresent()) {
    		throw new Exception("User not exists");
    	}
    	return facialRecognitionClient.facialRecognitionCompare(new FacialRecognitionDTO(user.get().getLogin(), user.get().getFaceId(), facialRecognition.getImageValue()));    	
    }
}
