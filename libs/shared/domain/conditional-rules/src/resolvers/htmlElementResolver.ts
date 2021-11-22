import { ExcludeFalsy } from '@scrapper-gate/shared/common';
import {
  ConditionalRuleType,
  HtmlConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import { RuleResolver } from '../types';
import { arrayValueResolver } from './arrayValueResolver';

export interface HtmlElementResolverElementDefinition {
  textContent?: string;
  attributes?: Record<string, unknown>;
  tag?: string;
}

export interface HtmlElementResolverParams {
  elements: HtmlElementResolverElementDefinition[];
}

// Create element definition from html element that is parsable by html element resolver
const createElementDefinition = (
  element: Pick<Element, 'tagName' | 'textContent'> & {
    attributes?: Record<string, unknown>;
  }
): HtmlElementResolverElementDefinition => {
  return {
    tag: element.tagName,
    textContent: element.textContent ?? '',
    attributes: element.attributes,
  };
};

const make =
  ({
    elements,
  }: HtmlElementResolverParams): RuleResolver<ConditionalRuleType.HtmlElement> =>
  (rule) => {
    switch (rule.type) {
      case HtmlConditionalRuleType.Attribute: {
        const attribute = rule.attribute?.attribute;

        if (!attribute) {
          return false;
        }

        const attributes = elements
          .map((el) => el.attributes?.[attribute])
          .filter(ExcludeFalsy);

        return arrayValueResolver({
          condition: rule.condition,
          expectedValue: rule.attribute?.value,
          values: attributes,
          matchType: rule.matchType,
        });
      }

      case HtmlConditionalRuleType.Tag: {
        const { tagName } = rule;

        if (!tagName) {
          return false;
        }

        return arrayValueResolver({
          condition: rule.condition,
          expectedValue: tagName.toLowerCase(),
          values: elements.map((el) => el.tag?.toLowerCase()),
        });
      }

      case HtmlConditionalRuleType.Element:
        return arrayValueResolver({
          condition: rule.condition,
          values: elements.map((el) => el.textContent),
          matchType: rule.matchType,
          expectedValue: rule.expectedTextContent,
        });

      default:
        return false;
    }
  };

export const htmlElementResolver = {
  make,
  createElementDefinition,
};
