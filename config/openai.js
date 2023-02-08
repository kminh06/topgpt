import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  organization: 'org-ahdlKsrK8suAT3yPTJYeEQ7A',
  apiKey: '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',
});

// const configuration = new Configuration({
//   organization: process.env.OPENAI_ORG_ID,
//   apiKey: process.env.OPENAI_API_KEY,
// });

export const openai = new OpenAIApi(configuration)