const scenarios = {
  'has one ship': [
    {
      request: '/ship_log',
      response: {
        body: [{ name: 'The Jolly Roger', captain: 'Captain Hook' }],
      },
    },
  ],
  'has more ships': [
    {
      request: '/ship_log',
      response: {
        body: [
          { name: 'The Jolly Roger', captain: 'Captain Hook' },
          { name: 'The Black Pearl', captain: 'Jack Sparrow' },
          { name: 'Flying Dutchman', captain: 'Davy Jones' },
          { name: 'The Wanderer', captain: 'Captain Ron' },
        ],
      },
    },
  ],
  'has a server error': [
    {
      request: '/ship_log',
      response: {
        status: 500,
      },
    },
  ],
};

export default scenarios;
