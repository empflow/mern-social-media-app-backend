import { user1AuthHeader, jpegImgPath, user1 } from "../posts.test";
import { imgsUploadLimit } from "../../../utils/s3";
import expectMetadataToBeZero from "../expectMetadataToBeZero";
import expectPostIsOnCreatorsWall from "../expectPostIsOnCreatorsWall";
import expectImgsUrlsMatchHttps from "../../utils/expectImgsUrlsMatchHttps";
import getDescribeContent from "./getDescribeContent";
import getItContent from "./getItContent";
import makeRequest from "./makeRequest";
import { getFileCountExceedsLimitMsg } from "../../../config/multer";

export default function givenNImgsAndTextContent(
  imgsAmount: number,
  textContent: string | null
) {
  const describeContent = getDescribeContent(imgsAmount, textContent);
  const itContent = getItContent(imgsAmount, textContent);

  describe(describeContent, () => {
    it(itContent, async () => {
      const { body, statusCode } = await makeRequest(imgsAmount, textContent);
      
      const noContent = (imgsAmount < 1 && !textContent);
      const exceedsLimit = imgsAmount > imgsUploadLimit;

      if (noContent) expectIfNoContent();
      else if (exceedsLimit) expectIfExceedsLimit();
      else expectIfOk();


      function expectIfNoContent() {
        expect(statusCode).toBe(400);
        expect(body.message).toMatch(/no content/);
      }

      function expectIfExceedsLimit() {
        expect(statusCode).toBe(400);
        const expectRegex = getFileCountExceedsLimitMsg(imgsUploadLimit);
        expect(body.message).toMatch(new RegExp(expectRegex));
      }

      function expectIfOk() {
        expect(statusCode).toBe(201);
        expectMetadataToBeZero(body);
        expectPostIsOnCreatorsWall(body, user1);
        expectImgsUrlsMatchHttps(body, imgsAmount);
        if (textContent) {
          expect(body.content).toBe(textContent);
        }        
      }
    }, 10000)
  })
}
