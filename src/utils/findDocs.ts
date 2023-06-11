import { FilterQuery, Model, ProjectionType, UpdateQuery } from "mongoose";


export async function findDocsByIds<T>(
  model: Model<T>, ids: string[], projection?: ProjectionType<T>
) {
  const promises = ids.map(id => model.findById(id, projection));
  return await Promise.all(promises);
}


export async function findDocs<T>(
  model: Model<T>, queries: FilterQuery<T>[], projection?: ProjectionType<T>
) {
  const promises = queries.map(query => model.findOne(query, projection));
  return await Promise.all(promises);
}


export async function findDocByIdAndUpdate<T>(
  model: Model<T>, id: string, update: UpdateQuery<T>, projection?: ProjectionType<T>
) {
  const updated = await model.findByIdAndUpdate(
    id, update, { new: true, runValidators: true, projection }
  );
  return updated;
}


export async function findDocAndUpdate<T>(
  model: Model<T>, filter: FilterQuery<T>, update: UpdateQuery<T>, projection?: ProjectionType<T>
) {
  const result = await model.findOneAndUpdate(
    filter, update, { new: true, runValidators: true, projection }
  );
  return result;
}
