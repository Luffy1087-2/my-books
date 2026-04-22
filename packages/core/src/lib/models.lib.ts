import { GoogleUserModel } from '../types/models.types.js';

export function isGoogleUserModelValid(model: GoogleUserModel | null | undefined) {
  return model
    && model.sub.length
    && model.email.length
    && model.email_verified
    && model.family_name.length
    && model.given_name.length
}
