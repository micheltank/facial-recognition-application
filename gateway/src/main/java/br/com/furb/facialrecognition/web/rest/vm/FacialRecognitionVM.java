package br.com.furb.facialrecognition.web.rest.vm;

public class FacialRecognitionVM {

    private String username;

    private String imageValue;

	public FacialRecognitionVM() {
	}

	public FacialRecognitionVM(String username, String imageValue) {
		super();
		this.username = username;
		this.imageValue = imageValue;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getImageValue() {
		return imageValue;
	}

	public void setImageValue(String imageValue) {
		this.imageValue = imageValue;
	}
    
}
