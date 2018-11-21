package br.com.furb.facialrecognition.microservice.service;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import org.xmlpull.v1.XmlPullParserException;

import io.minio.MinioClient;
import io.minio.errors.MinioException;

public class FileUploaderService {
	
  public static String upload(String fileName, InputStream fileValue) throws Exception {
    try {
      MinioClient minioClient = new MinioClient("https://play.minio.io:9000", "Q3AM3UQ867SPQQA43P2F", "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG");
      String bucketName = "furb";
      boolean isExist = minioClient.bucketExists("furb");
      if(isExist) {
        System.out.println("Bucket already exists.");
      } else {
        minioClient.makeBucket(bucketName);
      }
      // Upload the zip file to the bucket with putObject
      minioClient.putObject(bucketName, fileName, fileValue, "application/octet-stream");
      return minioClient.presignedGetObject(bucketName, fileName);
    } catch (MinioException | InvalidKeyException | NoSuchAlgorithmException | IOException | XmlPullParserException e) {
      System.out.println("Error occurred: " + e);
      throw e;
    }
  }
}