import { z } from 'zod'

function isRolesArray(arr: any[]): arr is ('user' | 'manager' | 'admin')[] {
  const validRoles = ['user', 'manager', 'admin']
  return (
    Array.isArray(arr) &&
    arr.every((role) => {
      return typeof role === 'string' && validRoles.includes(role)
    })
  )
}

export const schema = z.object({
  userName: z
    .string()
    .min(1, 'A userName is required.')
    .regex(
      new RegExp(/^[^\s]+(\s+[^\s]+)*$/),
      'The value must not begin or end with a space.'
    ),

  firstName: z.string().min(1, 'A first name is required.'),
  lastName: z.string().min(1, 'A last name is required.'),
  email: z.string().email('A valid email is required'),

  //# Is there a better way?
  phone: z
    .string()
    .min(1, 'A phone number is required.')
    .regex(
      new RegExp(/^[^\s]+(\s+[^\s]+)*$/),
      'The value must not begin or end with a space.'
    ),

  address: z
    .string()
    .min(1, 'An address is required.')
    .regex(
      new RegExp(/^[^\s]+(\s+[^\s]+)*$/),
      'The value must not begin or end with a space.'
    ),

  city: z
    .string()
    .min(1, 'A city is required.')
    .regex(
      new RegExp(/^[^\s]+(\s+[^\s]+)*$/),
      'The value must not begin or end with a space.'
    ),

  state: z
    .string()
    .min(1, 'A state is required.')
    .regex(
      new RegExp(/^[^\s]+(\s+[^\s]+)*$/),
      'The value must not begin or end with a space.'
    ),
  postalCode: z
    .string()
    .min(1, 'A postal code is required.')
    .regex(
      new RegExp(/^[^\s]+(\s+[^\s]+)*$/),
      'The value must not begin or end with a space.'
    ),

  country: z
    .string()
    .min(1, 'A country code is required.')
    .regex(
      new RegExp(/^[^\s]+(\s+[^\s]+)*$/),
      'The value must not begin or end with a space.'
    ),

  isActive: z.boolean({
    required_error: 'isActive is required.',
    invalid_type_error: 'isActive must be a boolean'
  }),

  roles: z
    .array(z.string())
    .refine((value) => value.includes('user'), {
      message: "The 'user' role is required."
    })

    .refine((value) => isRolesArray(value), {
      message: 'The roles array contains one or more invalid values.'
    })
})

export type FormValues = z.infer<typeof schema>
