import { PartialDeep } from 'type-fest';
import { BaseNodeProperties, FlowBuilderItem } from '../FlowBuilder.types';
import { isNodeConnectedTo } from './isNodeConnectedTo';

const trueCaseItems: PartialDeep<FlowBuilderItem<BaseNodeProperties>>[] = [
  {
    id: 'start',
    type: 'Start',
    position: {
      x: -164,
      y: -102,
    },
  },
  {
    id: 'c5897330-f873-4e54-8eae-38eb4d9ba287',
    position: {
      x: -1.75,
      y: -30,
    },
    type: 'Action',
  },
  {
    source: 'start',
    target: 'c5897330-f873-4e54-8eae-38eb4d9ba287',
    id: 'estart-c5897330-f873-4e54-8eae-38eb4d9ba287',
    style: {
      stroke: '#4527a0',
    },
    type: 'Normal',
  },
  {
    id: '90cc9dba-b04b-4a33-b902-5b87350e2583',
    position: {
      x: 185.25,
      y: 0,
    },
    type: 'Action',
  },
  {
    source: 'c5897330-f873-4e54-8eae-38eb4d9ba287',
    target: '90cc9dba-b04b-4a33-b902-5b87350e2583',
    id: 'ec5897330-f873-4e54-8eae-38eb4d9ba287-90cc9dba-b04b-4a33-b902-5b87350e2583',
    style: {
      stroke: '#4527a0',
    },
  },
];

const recursiveCaseItems: PartialDeep<FlowBuilderItem<BaseNodeProperties>>[] = [
  {
    id: 'start',
    type: 'Start',
    position: {
      x: -164,
      y: -102,
    },
  },
  {
    id: 'c5897330-f873-4e54-8eae-38eb4d9ba287',
    position: {
      x: -1.75,
      y: -30,
    },
    data: {
      title: 'Click',
    },
    type: 'Action',
  },
  {
    source: 'start',
    target: 'c5897330-f873-4e54-8eae-38eb4d9ba287',
    id: 'estart-c5897330-f873-4e54-8eae-38eb4d9ba287',
    style: {
      stroke: '#4527a0',
    },
    type: 'Normal',
  },
  {
    id: '90cc9dba-b04b-4a33-b902-5b87350e2583',
    position: {
      x: 185.25,
      y: 0,
    },
    type: 'Action',
  },
  {
    source: 'c5897330-f873-4e54-8eae-38eb4d9ba287',
    target: '90cc9dba-b04b-4a33-b902-5b87350e2583',
    id: 'ec5897330-f873-4e54-8eae-38eb4d9ba287-90cc9dba-b04b-4a33-b902-5b87350e2583',
    style: {
      stroke: '#4527a0',
    },
    type: 'Normal',
  },
  {
    source: '90cc9dba-b04b-4a33-b902-5b87350e2583',
    target: 'c5897330-f873-4e54-8eae-38eb4d9ba287',
    id: 'e90cc9dba-b04b-4a33-b902-5b87350e2583-c5897330-f873-4e54-8eae-38eb4d9ba287',
    style: {
      stroke: '#4527a0',
    },
    type: 'Normal',
  },
];

const falseCaseItems: PartialDeep<FlowBuilderItem<BaseNodeProperties>>[] = [
  {
    id: 'start',
    type: 'Start',
    position: {
      x: -164,
      y: -102,
    },
  },
  {
    id: 'c5897330-f873-4e54-8eae-38eb4d9ba287',
    position: {
      x: -1.75,
      y: -30,
    },
    data: {
      title: 'Click',
    },
    type: 'Action',
  },
  {
    id: '90cc9dba-b04b-4a33-b902-5b87350e2583',
    position: {
      x: 185.25,
      y: 0,
    },
    type: 'Action',
  },
];

const conditionalTestCase: PartialDeep<FlowBuilderItem<BaseNodeProperties>>[] =
  [
    {
      id: 'start',
      type: 'Start',
      position: {
        x: 50,
        y: 250,
      },
    },
    {
      id: '55a3f700-9b65-422d-9917-ad8f21f3ae15',
      position: {
        x: 200,
        y: 250,
      },
      type: 'Conditional',
    },
    {
      id: '8cd4415a-1aee-4c60-a124-ec8734824c07',
      position: {
        x: 350,
        y: 50,
      },
      type: 'Action',
    },
    {
      source: '55a3f700-9b65-422d-9917-ad8f21f3ae15',
      target: '8cd4415a-1aee-4c60-a124-ec8734824c07',
      id: 'e55a3f700-9b65-422d-9917-ad8f21f3ae15-8cd4415a-1aee-4c60-a124-ec8734824c07',
      label: 'If true',
      style: {
        stroke: '#4527a0',
      },
      type: 'Normal',
    },
    {
      id: 'db368af3-4b42-417e-970c-1d68d1feb6d6',
      position: {
        x: 350,
        y: 450,
      },
      type: 'Action',
    },
    {
      source: '55a3f700-9b65-422d-9917-ad8f21f3ae15',
      target: 'db368af3-4b42-417e-970c-1d68d1feb6d6',
      id: 'e55a3f700-9b65-422d-9917-ad8f21f3ae15-db368af3-4b42-417e-970c-1d68d1feb6d6',
      label: 'If false',
      style: {
        stroke: '#4527a0',
      },
      type: 'Normal',
    },
    {
      id: '84eebd35-f5db-4213-9da9-104eafd56007',
      position: {
        x: 500,
        y: 250,
      },
      type: 'Action',
    },
    {
      source: '8cd4415a-1aee-4c60-a124-ec8734824c07',
      target: '84eebd35-f5db-4213-9da9-104eafd56007',
      id: 'e8cd4415a-1aee-4c60-a124-ec8734824c07-84eebd35-f5db-4213-9da9-104eafd56007',
      style: {
        stroke: '#4527a0',
      },
      type: 'Normal',
    },
    {
      source: 'db368af3-4b42-417e-970c-1d68d1feb6d6',
      target: '84eebd35-f5db-4213-9da9-104eafd56007',
      id: 'edb368af3-4b42-417e-970c-1d68d1feb6d6-84eebd35-f5db-4213-9da9-104eafd56007',
      style: {
        stroke: '#4527a0',
      },
      type: 'Normal',
    },
    {
      source: 'start',
      target: '55a3f700-9b65-422d-9917-ad8f21f3ae15',
      id: 'estart-55a3f700-9b65-422d-9917-ad8f21f3ae15',
      style: {
        stroke: '#4527a0',
      },
      type: 'Normal',
    },
  ];

const longerPathCase = [
  {
    id: 'start',
    type: 'Start',
    position: {
      x: -128,
      y: -4,
    },
    data: {
      title: 'Start',
      cannotBeDeleted: true,
      icon: {
        type: {
          type: {},
          compare: null,
        },
        key: null,
        ref: null,
        props: {},
        _owner: null,
        _store: {},
      },
      noContent: true,
    },
  },
  {
    id: '0a91d5dd-8265-47ae-92c4-8969a2be1622',
    position: {
      x: 104.25,
      y: 6.5,
    },
    data: {
      title: 'Click',
      action: 'Click',
      type: 'Action',
      icon: {
        type: {
          type: {},
          compare: null,
        },
        key: null,
        ref: null,
        props: {},
        _owner: null,
        _store: {},
      },
      url: 'https://www.google.com/',
      mouseButton: 'left',
    },
    type: 'Action',
  },
  {
    source: 'start',
    target: '0a91d5dd-8265-47ae-92c4-8969a2be1622',
    id: 'estart-0a91d5dd-8265-47ae-92c4-8969a2be1622',
    data: {
      edgeVariation: 'Bezier',
      targetHandle: 'left',
      sourceHandle: 'right',
    },
    arrowHeadType: 'arrowclosed',
    style: {
      stroke: '#4527a0',
    },
    type: 'Normal',
  },
  {
    id: 'd63a2dbd-566c-47b0-b00a-05a1258f3d0f',
    position: {
      x: 302.9844184473411,
      y: 28.22108372306039,
    },
    data: {
      title: 'Click',
      action: 'Click',
      type: 'Action',
      icon: {
        type: {
          type: {},
          compare: null,
        },
        key: null,
        ref: null,
        props: {},
        _owner: null,
        _store: {},
      },
      url: 'https://www.google.com/',
      mouseButton: 'left',
    },
    type: 'Action',
  },
  {
    source: '0a91d5dd-8265-47ae-92c4-8969a2be1622',
    target: 'd63a2dbd-566c-47b0-b00a-05a1258f3d0f',
    id: 'e0a91d5dd-8265-47ae-92c4-8969a2be1622-d63a2dbd-566c-47b0-b00a-05a1258f3d0f',
    data: {
      edgeVariation: 'Bezier',
      targetHandle: 'left',
      sourceHandle: 'right',
    },
    arrowHeadType: 'arrowclosed',
    style: {
      stroke: '#4527a0',
    },
    type: 'Normal',
  },
  {
    id: '5734825a-24f6-4267-ae5d-6fb645e8ce70',
    position: {
      x: 544.5898859141347,
      y: 18.466138319807524,
    },
    data: {
      title: 'Click',
      action: 'Click',
      type: 'Action',
      icon: {
        type: {
          type: {},
          compare: null,
        },
        key: null,
        ref: null,
        props: {},
        _owner: null,
        _store: {},
      },
      url: 'https://www.google.com/',
      mouseButton: 'left',
    },
    type: 'Action',
  },
  {
    source: 'd63a2dbd-566c-47b0-b00a-05a1258f3d0f',
    target: '5734825a-24f6-4267-ae5d-6fb645e8ce70',
    id: 'ed63a2dbd-566c-47b0-b00a-05a1258f3d0f-5734825a-24f6-4267-ae5d-6fb645e8ce70',
    data: {
      edgeVariation: 'Bezier',
      targetHandle: 'left',
      sourceHandle: 'right',
    },
    arrowHeadType: 'arrowclosed',
    style: {
      stroke: '#4527a0',
    },
    type: 'Normal',
  },
];

describe('isNodeConnectedTo', () => {
  it('should return true if node is connected as target', () => {
    const result = isNodeConnectedTo(
      'c5897330-f873-4e54-8eae-38eb4d9ba287',
      '90cc9dba-b04b-4a33-b902-5b87350e2583',
      trueCaseItems as FlowBuilderItem<BaseNodeProperties>[]
    );

    expect(result).toEqual(true);
  });

  it('should return true if node is connected as source', () => {
    const result = isNodeConnectedTo(
      '90cc9dba-b04b-4a33-b902-5b87350e2583',
      'c5897330-f873-4e54-8eae-38eb4d9ba287',
      trueCaseItems as FlowBuilderItem<BaseNodeProperties>[]
    );

    expect(result).toEqual(true);
  });

  it('should return true if nodes are connected recursively', () => {
    const result = isNodeConnectedTo(
      'c5897330-f873-4e54-8eae-38eb4d9ba287',
      '90cc9dba-b04b-4a33-b902-5b87350e2583',
      recursiveCaseItems as FlowBuilderItem<BaseNodeProperties>[]
    );

    expect(result).toEqual(true);
  });

  it('should return true if nodes are connected recursively - reverse', () => {
    const result = isNodeConnectedTo(
      '90cc9dba-b04b-4a33-b902-5b87350e2583',
      'c5897330-f873-4e54-8eae-38eb4d9ba287',
      recursiveCaseItems as FlowBuilderItem<BaseNodeProperties>[]
    );

    expect(result).toEqual(true);
  });

  it('should return true if nodes are connected - case with conditional node - bottom node', () => {
    const result = isNodeConnectedTo(
      '84eebd35-f5db-4213-9da9-104eafd56007',
      'db368af3-4b42-417e-970c-1d68d1feb6d6',
      conditionalTestCase as FlowBuilderItem<BaseNodeProperties>[]
    );

    expect(result).toEqual(true);
  });

  it('should return true if nodes are connected - case with conditional node - top node', () => {
    const result = isNodeConnectedTo(
      '84eebd35-f5db-4213-9da9-104eafd56007',
      '8cd4415a-1aee-4c60-a124-ec8734824c07',
      conditionalTestCase as FlowBuilderItem<BaseNodeProperties>[]
    );

    expect(result).toEqual(true);
  });

  it('should return false if nodes are not connected', () => {
    const result = isNodeConnectedTo(
      '90cc9dba-b04b-4a33-b902-5b87350e2583',
      'c5897330-f873-4e54-8eae-38eb4d9ba287',
      falseCaseItems as FlowBuilderItem<BaseNodeProperties>[]
    );

    expect(result).toEqual(false);
  });

  it('should return true if node are connected not directly', () => {
    const result = isNodeConnectedTo(
      '5734825a-24f6-4267-ae5d-6fb645e8ce70',
      '0a91d5dd-8265-47ae-92c4-8969a2be1622',
      longerPathCase as FlowBuilderItem<BaseNodeProperties>[]
    );

    expect(result).toEqual(true);
  });
});
