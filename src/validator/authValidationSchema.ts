import vine from "@vinejs/vine";

export const registerSchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(30),
  email: vine.string().email(),
  password: vine.string().minLength(6).maxLength(20).confirmed(),
});

export const loginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string().minLength(6),
});

export const corporateRegisterSchema = vine.object({
  companyName: vine.string().trim().minLength(2).maxLength(100),
  contactPerson: vine.object({
    name: vine.string().trim().minLength(2).maxLength(50),
    position: vine.string().trim().minLength(2).maxLength(50),
    email: vine.string().email(),
    phone: vine.string().trim().regex(/^\+?[0-9]{6,15}$/)
  }),
  officeAddress: vine.object({
    street: vine.string().trim().minLength(5).maxLength(100),
    city: vine.string().trim().minLength(2).maxLength(50),
    state: vine.string().trim().minLength(2).maxLength(50),
  }),
  preferredProgramDate: vine.string().optional(),
  additionalRemarks: vine.string().trim().maxLength(500).optional()
});

export const contactSchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(30),
  email: vine.string().email(),
  phoneNumber: vine.string().trim().regex(/^\+?[\d\s]{10,15}$/),
  message: vine.string().trim().maxLength(500)
})

export const seekerSchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(30),
  city: vine.string().trim().minLength(2).maxLength(50),
  phoneNumber: vine.string().trim().regex(/^\+?[\d\s]{10,15}$/),
})

export const journeyRecommendationSchema = vine.object({
  isNewToMeditation: vine.boolean(),
  preferredMode: vine.enum(["in_person", "online"] as const),
  city: vine.string().trim().minLength(2).maxLength(80).optional(),
  sessionKey: vine.string().trim().maxLength(120).optional(),
  sourcePage: vine.string().trim().maxLength(120).optional(),
  latitude: vine.number().min(-90).max(90).optional(),
  longitude: vine.number().min(-180).max(180).optional(),
})

export const journeySupportSchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(50),
  email: vine.string().email(),
  phoneNumber: vine.string().trim().regex(/^\+?[\d\s]{10,15}$/),
  city: vine.string().trim().minLength(2).maxLength(80).optional(),
  isNewToMeditation: vine.boolean(),
  preferredMode: vine.enum(["in_person", "online"] as const),
  sessionKey: vine.string().trim().maxLength(120).optional(),
  notes: vine.string().trim().maxLength(500).optional(),
})

export const centerSchema = vine.object({
  address: vine.string().trim().minLength(5).maxLength(200),
  day: vine.string().trim().minLength(3).maxLength(10),
  time: vine.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  zone: vine.string().trim().minLength(2).maxLength(100),
  city: vine.string().trim().minLength(2).maxLength(100).optional(),
  contactNumbers: vine.string().trim().regex(/^[\d, ]+$/),
  link: vine.string().trim().url().optional(),
  weeklyUpdate: vine.string().trim().maxLength(500).optional(),
  announcement: vine.string().trim().maxLength(500).optional(),
});

export const schoolRegisterSchema = vine.object({
  schoolName: vine.string().trim().minLength(2).maxLength(100),
  contactPerson: vine.object({
    name: vine.string().trim().minLength(2).maxLength(50),
    role: vine.string().trim().minLength(2).maxLength(50),
    email: vine.string().email(),
    phone: vine.string().trim().regex(/^\+?[0-9]{6,15}$/)
  }),
  schoolAddress: vine.object({
    street: vine.string().trim().minLength(5).maxLength(100),
    city: vine.string().trim().minLength(2).maxLength(50),
    state: vine.string().trim().minLength(2).maxLength(50),
  }),
  preferredProgramDate: vine.string().optional(),
  additionalRemarks: vine.string().trim().maxLength(500).optional()
});
