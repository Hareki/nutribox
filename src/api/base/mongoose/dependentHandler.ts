import type { Document, Types } from 'mongoose';

export const updateDependentDoc = async (
  referenceId: Types.ObjectId,
  dependentDoc: Document,
  dependentArrayName: string,
) => {
  const dependentIdentifier = `${dependentDoc.baseModelName} with id ${dependentDoc._id}`;

  if (!dependentDoc) {
    throw new Error(`${dependentIdentifier} does not exist.`);
  }
  (dependentDoc[dependentArrayName] as Types.ObjectId[]).push(referenceId);

  try {
    await dependentDoc.save();
  } catch {
    throw new Error(
      `There was an error while update dependent doc ${dependentIdentifier}.`,
    );
  }
};

export const revertUpdateDependentDoc = async (
  referenceId: Types.ObjectId,
  dependentDoc: Document,
  dependentArrayName: string,
) => {
  if (dependentDoc) {
    dependentDoc[dependentArrayName] = (
      dependentDoc[dependentArrayName] as Types.ObjectId[]
    ).filter((id) => id.toString() !== referenceId.toString());
    await dependentDoc.save();
  }
};