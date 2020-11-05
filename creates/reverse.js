const reverser = x => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x.split('').reverse().join(''));
    }, 1000);
  });
};

module.exports = {
  key: 'reverse',

  noun: 'Reverse',
  display: {
    label: 'Reverse a string',
    description: 'Reverses a string.',
  },

  operation: {
    inputFields: [
      {
        key: 'str',
        required: true,
        type: 'text',
        helpText: 'The string to reverse.',
      },
    ],

    perform: async (z, bundle) => {
      return {
        reversedString: await reverser(bundle.inputData.str),
      };
    },

    outputFields: [
      { key: 'reversedString', label: 'Reversed String' },
    ],

    sample: {
      reversedString: '.sdrawkcaB',
    },
  },
};