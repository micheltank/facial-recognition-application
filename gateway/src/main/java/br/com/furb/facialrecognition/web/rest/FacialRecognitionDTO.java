package br.com.furb.facialrecognition.web.rest;

public class FacialRecognitionDTO {

	private String username;
	private String faceId;
	private String imageValue;

	public FacialRecognitionDTO() {
		super();
	}

	public FacialRecognitionDTO(String username, String faceId, String imageValue) {
		super();
		this.username = username;
		this.faceId = faceId;
		this.imageValue = imageValue;
	}

	public String getFaceId() {
		return faceId;
	}

	public void setFaceId(String faceId) {
		this.faceId = faceId;
	}

	public String getImageValue() {
		return imageValue;
	}

	public void setImageValue(String imageValue) {
		this.imageValue = imageValue;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
}
