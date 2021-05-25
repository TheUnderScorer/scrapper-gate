import { VariableRepository } from '@scrapper-gate/backend/domain/variables';
import { ScrapperUpdatedEvent } from '@scrapper-gate/shared/domain/scrapper';
import { VariableScope } from '@scrapper-gate/shared/schema';
import { eventHandler } from 'functional-cqrs';

export interface VariablesSubscriberDependencies {
  variableRepository: VariableRepository;
}

@eventHandler.asClass({
  handlers: [
    {
      method: 'onScrapperUpdate',
      eventName: ScrapperUpdatedEvent.name,
    },
  ],
})
export class VariablesSubscriber {
  constructor(private readonly dependencies: VariablesSubscriberDependencies) {}

  async onScrapperUpdate({ payload: { variables } }: ScrapperUpdatedEvent) {
    if (!variables.length) {
      return;
    }

    const globalVariables = variables.filter(
      (variable) => variable.scope === VariableScope.Global
    );

    await this.dependencies.variableRepository.save(globalVariables);
  }
}
