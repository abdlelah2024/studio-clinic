
'use server';

/**
 * @fileOverview Deletes a user from Firebase Authentication.
 *
 * - deleteUser - A function that deletes a user from Firebase Auth.
 * - DeleteUserInput - The input type for the deleteUser function.
 * - DeleteUserOutput - The return type for the deleteUser function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';
import 'dotenv/config';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
    try {
        const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        if (!credentialsJson) {
            throw new Error("GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set.");
        }
        const credentials = JSON.parse(credentialsJson);

        admin.initializeApp({
            credential: admin.credential.cert(credentials),
        });
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
        console.error("Error initializing Firebase Admin SDK:", error);
    }
}


const DeleteUserInputSchema = z.object({
  email: z.string().email().describe('The email address of the user to delete.'),
});
export type DeleteUserInput = z.infer<typeof DeleteUserInputSchema>;

const DeleteUserOutputSchema = z.object({
  success: z.boolean().describe('Whether the user was deleted successfully.'),
  message: z.string().describe('A message indicating the result of the operation.'),
});
export type DeleteUserOutput = z.infer<typeof DeleteUserOutputSchema>;

export async function deleteUser(
  input: DeleteUserInput
): Promise<DeleteUserOutput> {
  return deleteUserFlow(input);
}


const deleteUserFlow = ai.defineFlow(
  {
    name: 'deleteUserFlow',
    inputSchema: DeleteUserInputSchema,
    outputSchema: DeleteUserOutputSchema,
  },
  async ({ email }) => {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().deleteUser(userRecord.uid);
        console.log(`Successfully deleted user with email: ${email}`);
        return { success: true, message: `Successfully deleted user ${email}.` };
    } catch (error: any) {
        console.error(`Error deleting user ${email}:`, error);
        
        // User not found is not a failure of the flow, but a state.
        if (error.code === 'auth/user-not-found') {
             return { success: true, message: `User with email ${email} not found in Firebase Auth.` };
        }

        return { success: false, message: `Error deleting user: ${error.message}` };
    }
  }
);
