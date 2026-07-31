import vine from "@vinejs/vine";

export const volunteerInviteAcceptSchema = vine.object({
  phone: vine.string().trim().regex(/^\+?[0-9+\-\s]{8,15}$/),
  city: vine.string().trim().minLength(2).maxLength(80),
  state: vine.string().trim().maxLength(80).optional(),
  language: vine.string().trim().maxLength(40).optional(),
  interests: vine.array(vine.string().trim().maxLength(60)).maxLength(20).optional(),
});
