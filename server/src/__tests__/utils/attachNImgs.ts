import path from "node:path";
import supertest, { Response, SuperTest } from "supertest";

export default async function attachNFiles(
  field: string,
  absoluteFilePath: string,
  amount: number,
  reqToAttachFilesTo: supertest.Test
) {
  for (let i = 0; i < amount; i++) {
    reqToAttachFilesTo.attach(field, absoluteFilePath);
  }
  
  return reqToAttachFilesTo;
}