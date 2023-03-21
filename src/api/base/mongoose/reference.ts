import type { Document, Model, Types } from 'mongoose';
import { model } from 'mongoose';

type Action = 'save' | 'findOneAndDelete';
type NextFn = (error?: Error) => void;

interface HandlePostSaveOrRemoveParams<T extends Document> {
  action: Action;
  doc: T;
  fieldName: string;
  referencedFieldName: string;
  referencedModelName: string;
  next: NextFn;
}

export async function handleReferenceChange<T extends Document>({
  action,
  doc,
  fieldName,
  referencedFieldName,
  referencedModelName,
  next,
}: HandlePostSaveOrRemoveParams<T>): Promise<void> {
  try {
    const currentDoc = doc;
    const referencedModel: Model<Document> = model(referencedModelName);
    const referencedDoc = await referencedModel.findById(currentDoc[fieldName]);

    if (referencedDoc) {
      if (action === 'save') {
        referencedDoc[referencedFieldName].push(currentDoc._id);
      } else if (action === 'findOneAndDelete') {
        referencedDoc[referencedFieldName] = referencedDoc[
          referencedFieldName
        ].filter((docId: Types.ObjectId) => docId.toString() !== currentDoc.id);
      }

      await referencedDoc.save();
      next();
    } else {
      const error = new Error(`Referenced ${referencedModelName} not found`);
      next(error);
    }
  } catch (error) {
    next(error);
  }
}
