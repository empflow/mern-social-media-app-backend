import { FilterQuery, Model, UpdateQuery } from "mongoose";

export async function findDocsById<T>(model: Model<T>, ids: string[]) {
  const promises = ids.map(id => model.findById(id));
  return await Promise.all(promises);
}

export async function findDocs<T>(model: Model<T>, queries: FilterQuery<T>[]) {
  const promises = queries.map(query => model.findOne(query));
  return await Promise.all(promises);
}

export async function findDocByIdAndUpdate<T>(
  model: Model<T>, id: string, update: UpdateQuery<T>
) {
  const updated = await model.findByIdAndUpdate(
    id, update, { new: true, runValidators: true }
  );
  return updated;
}

export async function findDocAndUpdate<T>(
  model: Model<T>, filter: FilterQuery<T>, update: UpdateQuery<T>
) {
  const result = await model.findOne(
    filter, update, { new: true, runValidators: true }
  );
  return result;
}