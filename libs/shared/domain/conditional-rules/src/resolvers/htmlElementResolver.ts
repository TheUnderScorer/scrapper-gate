import { ExcludeFalsy } from '@scrapper-gate/shared/common';
import { ConditionalRule } from '@scrapper-gate/shared/schema';
import { HtmlElementRuleMeta, HtmlElementWhat, RuleResolver } from '../types';
import { arrayValueResolver } from './arrayValueResolver';

export interface HtmlElementResolverElementDefinition {
  textContent?: string;
  attributes?: Record<string, string>;
  tag?: string;
}

export interface HtmlElementResolverParams {
  elements?: HtmlElementResolverElementDefinition[];
}

const resolveValue = (
  rule: ConditionalRule,
  elements: HtmlElementResolverElementDefinition[],
  meta: HtmlElementRuleMeta
): unknown[] => {
  switch (rule.what) {
    case HtmlElementWhat.Attribute:
      if (!meta.attribute) {
        return [];
      }

      return elements
        .map((el) => el?.attributes?.[meta.attribute as string])
        .filter(ExcludeFalsy);

    case HtmlElementWhat.Tag:
      return elements.map((el) => el.tag?.toLowerCase()).filter(ExcludeFalsy);

    default:
      return [];
  }
};

// Create element definition from html element that is parsable by html element resolver
export const createHtmlResolverElementDefinition = (
  element: Pick<Element, 'tagName' | 'textContent' | 'attributes'>
): HtmlElementResolverElementDefinition => {
  return {
    tag: element.tagName,
    textContent: element.textContent ?? '',
    attributes: Array.from(element.attributes).reduce((acc, attr) => {
      return {
        ...acc,
        [attr.name]: attr.value,
      };
    }, {}),
  };
};

export const makeHtmlElementResolver =
  ({ elements }: HtmlElementResolverParams): RuleResolver =>
  (rule) => {
    const meta = rule.meta as HtmlElementRuleMeta;

    if (!rule.what) {
      return arrayValueResolver(rule, elements, meta.type);
    }

    const value = resolveValue(rule, elements ?? [], meta);

    return arrayValueResolver(
      {
        ...rule,
        value:
          rule.what === HtmlElementWhat.Tag
            ? rule.value?.toString().toLowerCase()
            : rule.value,
      },
      value,
      meta.type
    );
  };
