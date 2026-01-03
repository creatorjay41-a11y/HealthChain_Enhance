import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  return {
    statusCode: 301,
    headers: {
      'Location': 'https://www.jotform.com/app/253583637449470',
    },
  };
};

export { handler };
