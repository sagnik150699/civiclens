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
  reason: z.string().describe('A concise, one-sentence reason for the assigned priority, written for a city official.'),
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
  prompt: `You are an AI assistant for municipal staff. Your task is to prioritize public issue reports based on urgency and potential impact. Analyze the description and photo to determine a priority level (High, Medium, or Low).

  Prioritization Guidelines:
  - High: Poses an immediate threat to public safety or can cause significant property damage (e.g., major water leak, fallen power lines, large sinkhole).
  - Medium: Disrupts public services or quality of life but is not an immediate danger (e.g., overflowing trash, broken streetlight, large graffiti).
  - Low: Minor cosmetic issues or inconveniences (e.g., small pothole, minor graffiti).

  Description: {{{description}}}
  {{#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}

  Respond with a JSON object containing the 'priority' and a concise 'reason' for your decision.
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
