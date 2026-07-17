/**
 * @dossier-x/engine — grading and certificate-eligibility logic.
 *
 * Compares a player's recorded answers against a case's questions.json
 * and determines certificate eligibility against certificate.json's
 * minimumScore. See grading.ts for the "where does the answer key live"
 * design note.
 */
export * from "./grading";
