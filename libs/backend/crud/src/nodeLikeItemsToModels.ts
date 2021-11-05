import { BaseModel } from '@scrapper-gate/backend/base-model';
import { NodeLikeItem, NodeLikeItemInput } from '@scrapper-gate/shared/node';

const propertiesToOverwrite: Array<
  [keyof NodeLikeItemInput, 'nextStep' | 'stepOnFalse' | 'stepOnTrue']
> = [
  ['nextStepId', 'nextStep'],
  ['stepIdOnFalse', 'stepOnFalse'],
  ['stepIdOnTrue', 'stepOnTrue'],
];

export interface NodeLikeItemsParams<
  Model extends BaseModel<NodeLikeItem> & NodeLikeItem,
  Input extends NodeLikeItemInput
> {
  input: Input[];
  existingSteps: NodeLikeItem[];
  createModel: (input: Input) => Model;
}

interface MappedItems<T> extends NodeLikeItemInput {
  model: T;
}

/**
 * Parses node like items and builds relation from them using given database model
 * */
export const nodeLikeItemsToModels = <
  Model extends BaseModel<unknown> & NodeLikeItem,
  Input extends NodeLikeItemInput = NodeLikeItemInput
>({
  input,
  existingSteps,
  createModel,
}: NodeLikeItemsParams<Model, Input>) => {
  const existingStepIds = existingSteps.map((step) => step.id);

  return input
    .map((step) => {
      const existingStep = existingSteps.find(
        (existingStep) => existingStep.id === step.id
      );

      const model = createModel({
        ...existingStep,
        ...step,
      });

      return {
        model: model,
        nextStepId: step.nextStepId,
        stepIdOnTrue: step.stepIdOnTrue,
        stepIdOnFalse: step.stepIdOnFalse,
      } as MappedItems<Model>;
    })
    .map(({ model }, index, array) => {
      const oldId = model.id;

      if (!existingStepIds.includes(model.id)) {
        model.generateId(true);
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
