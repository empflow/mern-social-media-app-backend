import getStrOfLength from "../../utils/getStrOfLength";
import { signUpData } from "../auth.test";
import requests from "supertest";
import app from "../../index";
import assertJson from "./assertJson";

export default function fieldIsOfLength(
  field: string, length: number, maxAllowedLength: number, minAllowedLength: number = 0
) {
  const [describeContent, itContent] = getTestContentBasedOnFieldLength(
    field, length, maxAllowedLength, minAllowedLength
  );
  const expectedStatusCode = getExpectedStatusCodeBasedOnFieldLength(
    length, maxAllowedLength, minAllowedLength
  );

  describe(describeContent, () => {
    it(itContent, async () => {
      const { body, statusCode, headers } = await requests(app)
        .post("/auth/sign-up")
        .send({ ...signUpData, firstName: getStrOfLength(length) });
      
        assertJson(headers);
        expect(statusCode).toBe(expectedStatusCode);

        if (expectedStatusCode === 201) {
          expect(body.user).toBeDefined();
          expect(body.token).toBeDefined();
        } else {
          expect(body.message).toBeDefined();
        }
    })
  })
}

function getExpectedStatusCodeBasedOnFieldLength(
  length: number, maxAllowedLength: number, minAllowedLength: number = 0
) {
  let statusCode = 201;
  
  if (length > maxAllowedLength || length < minAllowedLength) {
    statusCode = 400;
  }

  return statusCode;
}

function getTestContentBasedOnFieldLength(
  field: string, length: number, maxAllowedLength: number, minAllowedLength: number
) {
  let describeContent = "";

  const matchesMaxAllowed = length === maxAllowedLength;
  const matchesMinAllowed = length === minAllowedLength;
  const isOverMaxAllowed = length > maxAllowedLength;
  const isLessThanMinAllowed = length < minAllowedLength;

  console.log(`${length} === ${minAllowedLength}`);
  console.log(matchesMinAllowed);

  if (matchesMaxAllowed) {
    describeContent = `${field} length matches max allowed length (${maxAllowedLength})`;
  } else if (matchesMinAllowed) {
    describeContent = `${field} length matches min allowed length (${minAllowedLength})`;
  } else if (isOverMaxAllowed) {
    describeContent = `${field} length (${length}) is over max allowed length (${maxAllowedLength})`;
  } else if (isLessThanMinAllowed) {
    describeContent = `${field} length (${length}) is less than min allowed length (${minAllowedLength})`;
  } else {
    describeContent = `${field} length (${length}) is in allowed length range (${minAllowedLength}-${maxAllowedLength})`
  }

  let itContent = "returns 201 created user and token";
  if (isOverMaxAllowed || isLessThanMinAllowed) {
    itContent = "returns 400 BadRequest error";
  }

  return [describeContent, itContent];
}