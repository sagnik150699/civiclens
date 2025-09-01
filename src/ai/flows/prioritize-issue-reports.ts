// Prioritize incoming issue reports based on keywords and data.

'use server';

/**
 * @fileOverview A flow to prioritize issue reports based on description and attached data.
 *
 * - prioritizeIssueReport - A function that prioritizes issue reports.
 * - PrioritizeIssueReportInput - The input type for the prioritizeIssueReport function.
 * - PrioritizeIssueReportOutput - The return type for the prioritizeIssueReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeIssueReportInputSchema = z.object({
  description: z.string().describe('The description of the issue report.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
});

export type PrioritizeIssueReportInput = z.infer<typeof PrioritizeIssueReportInputSchema>;

const PrioritizeIssueReportOutputSchema = z.object({
  priority: z
    .string()
    .describe(
      'The priority of the issue report, can be High, Medium, or Low.'
    ),
  reason: z.string().describe('The reason for the assigned priority.'),
});

export type PrioritizeIssueReportOutput = z.infer<typeof PrioritizeIssueReportOutputSchema>;

export async function prioritizeIssueReport(
  input: PrioritizeIssueReportInput
): Promise<PrioritizeIssueReportOutput> {
  return prioritizeIssueReportFlow(input);
}

const prioritizeIssueReportPrompt = ai.definePrompt({
  name: 'prioritizeIssueReportPrompt',
  input: {schema: PrioritizeIssueReportInputSchema},
  output: {schema: PrioritizeIssueReportOutputSchema},
  prompt: `You are an AI assistant that helps municipal staff prioritize issue reports.

  Given the following issue report description and attached photo (if available), determine the priority of the issue (High, Medium, or Low) and provide a reason for the assigned priority.

  Description: {{{description}}}
  {{#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}

  Respond with a JSON object that contains the 'priority' (High, Medium, or Low) and 'reason' for the assigned priority.
`,
});

const prioritizeIssueReportFlow = ai.defineFlow(
  {
    name: 'prioritizeIssueReportFlow',
    inputSchema: PrioritizeIssueReportInputSchema,
    outputSchema: PrioritizeIssueReportOutputSchema,
  },
  async input => {
    const {output} = await prioritizeIssueReportPrompt(input);
    return output!;
  }
);
