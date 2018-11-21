import { PersonFacialRecognitionModule } from './person-facial-recognition.module';

describe('PersonFacialRecognitionModule', () => {
  let personFacialRecognitionModule: PersonFacialRecognitionModule;

  beforeEach(() => {
    personFacialRecognitionModule = new PersonFacialRecognitionModule();
  });

  it('should create an instance', () => {
    expect(personFacialRecognitionModule).toBeTruthy();
  });
});
