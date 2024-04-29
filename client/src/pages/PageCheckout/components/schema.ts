import { z } from 'zod'

export const schema = z.object({
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
    )
})

export type FormValues = z.infer<typeof schema>

export const defaultValues: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: ''
}
