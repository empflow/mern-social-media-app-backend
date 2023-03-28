import { FilterQuery, Model } from "mongoose";

export async function findDocsById<T>(model: Model<T>, ids: string[]) {
  const promises = ids.map(id => model.findById(id));
  return await Promise.all(promises);;
}

export async function findDocs<T>(model: Model<T>, queries: FilterQuery<T>[]) {
  const promises = queries.map(query => model.findOne(query));
  return await Promise.all(promises);
}