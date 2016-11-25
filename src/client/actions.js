export * from "../server/shared/actions";

//
// ─── APP STORE ──────────────────────────────────────────────────────────────────
//

export const DIALOG_SET = 'DIALOG_SET';
export const dialogSet = (id, isOpen, props = {}) => ({ type: DIALOG_SET, id, isOpen, props });

export const DIALOG_LOGIN = 'DIALOG_LOGIN';