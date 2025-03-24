import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const RegisterSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  // .min(6, "Password must be at least 6 characters long")
  // .max(14, "Password cannot exceed 14 characters")
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[\W_]/, "Password must contain at least one special character")
});

const sportSchema = z.object({
  category: z.enum(["Individual Sports", "Team Sports", "Group Sports"], {
    errorMap: (issue, ctx) => {
      return { message: "Please select a sport category" };
    }
  }),
  name: z.enum([
    "Tennis", "Ping Pong", "Squash", 
    "Football", "Basketball", "Volleyball", 
    "Hiking", "Ice Skating", "Yoga"
  ], {
    errorMap: (issue, ctx) => {
      return { message: "Please select a specific sport" };
    }
  })
});

const locationSchema = z.object({
  name: z.string().min(1, "Empty location is not allowed!"),
  latitude: z.number(),
  longitude: z.number(),
  formattedAddress: z.string().nonempty(),
  city: z.string(),
  country: z.string()
});

export const createSchema = z
  .object({
    sport: sportSchema,
    startsAt: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
        "Invalid datetime format (YYYY-MM-DDTHH:mm:ss.sssZ)"
      )
      .refine((dateString) => {
        const startsAtDate = new Date(dateString);
        const now = new Date();
        return startsAtDate > now;
      }, {
        message: "Event start time must be in the future",
      }),
    title: z.string().max(50, "Title must be at most 50 characters"),
    locationDTO: locationSchema,
    description: z
      .string()
      .max(500, "Description must be at most 500 characters"),
    teamNumber: z.number().refine((val) => val === 0 || val === 2, {
      message: "Team number must be 0 (Group Sports) or 2 (Other Sports)",
    }),
    playerNumber: z
      .number({ invalid_type_error: "Please supply a number" })
      .min(1)
      .max(100, "Player number must be between 1 and 100"),
  })
  .superRefine((data, ctx) => {
    const { category } = data.sport;

    if (category === "Individual Sports") {
      if (data.teamNumber !== 2) {
        ctx.addIssue({
          path: ["teamNumber"],
          message: "For Individual Sports, teamNumber must be '2 Teams'",
        });
      }
      if (data.playerNumber !== 1) {
        ctx.addIssue({
          path: ["teamNumber"],
          message: "Individual sports can have 1 player per team'",
        });
      }
    } else if (category === "Group Sports") {
      if (data.teamNumber !== 0) {
        ctx.addIssue({
          path: ["teamNumber"],
          message: "For Group Sports, teamNumber must be 0",
        });
      }
    } else if (category === "Team Sports") {
      if (data.teamNumber !== 2) {
        ctx.addIssue({
          path: ["teamNumber"],
          message: "For Team Sports, teamNumber must be '2 Teams'",
        });
      }
      if (data.playerNumber > 11 || data.playerNumber < 0) {
        ctx.addIssue({
          path: ["teamNumber"],
          message:
            "Team sports must have at least 1 player and at most 11 players per team ",
        });
      }
    }
  });
