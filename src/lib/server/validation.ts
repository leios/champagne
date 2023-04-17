import { z } from 'zod';
import { categories } from '$lib/config';
import { MAX_IMG_SIZE } from './config';

const SHARP_IMAGE_INPUT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const CategorySchema = z.enum(categories);

// Waiting for https://github.com/colinhacks/zod/pull/2157 or https://github.com/colinhacks/zod/pull/2274 to be merged
const EmailSchema = z
	.string()
	.regex(/^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i);
// const EmailSchema = z.string().email();

export const EmailForm = z.object({
	email: EmailSchema
});

export const TokenSchema = z.string().uuid();
export const TokenForm = z.object({
	token: TokenSchema
});

const UrlSchema = z
	.string()
	.url({ message: 'Invalid url, please provide the full url with the https:// prefix' })
	.refine((str) => !str.includes('playlist'), { message: 'Playlists are not allowed' });

export const FlagForm = z.object({
	link: UrlSchema,
	userToken: TokenSchema
});
export const PasswordForm = z.object({
	password: z.string()
});

const CheckboxSchema = z.literal('on', {
	errorMap: () => {
		return { message: 'Must be checked' };
	}
});

const JudgeSchema = z.object({
	userType: z.literal('judge'),
	email: EmailSchema,
	rules: CheckboxSchema
});

const CreatorSchema = z.object({
	userType: z.literal('creator'),
	email: EmailSchema,
	others: z.string().transform((val, ctx) => {
		try {
			return z.array(z.string().email()).parse(JSON.parse(val));
		} catch {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Invalid email'
			});

			return z.NEVER;
		}
	}),
	category: CategorySchema,
	title: z
		.string()
		.trim()
		.min(1, { message: 'Title cannot be empty' })
		.max(64, { message: 'Title too long' }),
	description: z
		.string()
		.trim()
		.min(10, { message: 'Description too short' })
		.max(500, { message: 'Description too long' }),
	link: UrlSchema,
	thumbnail: z
		.instanceof(File)
		.refine((file) => file.size < MAX_IMG_SIZE, { message: 'Image too big: 1MB max' })
		.refine((file) => SHARP_IMAGE_INPUT_TYPES.includes(file.type), {
			message: 'Must be a jpeg, png, webp or gif image'
		})
		.optional(),
	rules: CheckboxSchema
});

export const RegistrationSchema = z.discriminatedUnion('userType', [JudgeSchema, CreatorSchema]);

export const FlagSchema = z.object({
	reason: z.string().min(1).max(140),
	link: UrlSchema
});

export const EdgesSchema = z.array(
	z.object({
		category: CategorySchema,
		edges: z.array(z.array(z.number()))
	})
);

/**
 * Generic schema validation function to be used in actions
 * @param request A request with formData
 * @param schema The schema to validate the form against. Must be a z.object
 * @returns typed validated data or throws
 */
export async function validateForm<T extends Record<string, unknown>, S>(
	request: Request,
	schema: S extends z.ZodType ? z.ZodType<T> : any
) {
	const formData = await request.formData();
	const form = Object.fromEntries(formData);
	const validation = schema.safeParse(form);

	return validation;
}
