import { BaseModel } from '@scrapper-gate/backend/base-model';
import { NodeLikeItem, NodeLikeItemInput } from '@scrapper-gate/shared/schema';

const propertiesToOverwrite: Array<
  [keyof NodeLikeItemInput, 'nextStep' | 'stepOnFalse' | 'stepOnTrue']
> = [
  ['nextStepId', 'nextStep'],
  ['stepIdOnFalse', 'stepOnFalse'],
  ['stepIdOnTrue', 'stepOnTrue'],
];

export interface NodeLikeItemsParams<
  Model extends BaseModel<unknown>,
  Input extends NodeLikeItemInput
> {
  input: Input[];
  existingSteps: NodeLikeItem[];
  createModel: (input: Input) => Model;
}

/**
 * Parses node like items and builds relation from them using given database model
 * */
export const nodeLikeItemsToModels = <
  Model extends BaseModel<unknown>,
  Input extends NodeLikeItemInput
>({
  input,
  existingSteps,
  createModel,
}: NodeLikeItemsParams<Model, Input>) => {
  const existingStepIds = existingSteps.map((step) => step.id);

  return input
    .map((step) => ({
      model: createModel(step),
      nextStepId: step.nextStepId,
      stepIdOnTrue: step.stepIdOnTrue,
      stepIdOnFalse: step.stepIdOnFalse,
    }))
    .map(({ model }, index, array) => {
      const oldId = model.id;

      if (!existingStepIds.includes(model.id)) {
        // Ensure that we won't use client generated id
        delete model.id;

        model.generateId();
      }

      if (oldId) {
        // Setup relations using this model
        propertiesToOverwrite.forEach(([key, targetKey]) => {
          const relatedSteps = array.filter(
            (arrayItem) => arrayItem[key] === oldId
          );

          relatedSteps.forEach((item) => {
            item.model[targetKey] = model;
          });
        });
      }

      return model;
    });
};
