import { z } from 'zod'

export const schema = z
  .object({
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
    // Here the only requirement for password is that it be a string.
    password: z.string(),
    // Here the only requirement for confirmPassword is that it be a string.
    // However, below there is an additional check that ensures that confirmPassword
    // and password match. Thus, if a user does enter a password then this will need
    // to match that.
    confirmPassword: z.string(),

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
  ///////////////////////////////////////////////////////////////////////////
  //
  // This will validate confirmPassword against password.
  // However, in order to sync confirmPassword validation
  // with changes to password, we need to implement useEffct:
  //
  //   const password = watch('password')
  //   useEffect(() => { trigger('confirmPassword') }, [password, trigger])
  //
  ///////////////////////////////////////////////////////////////////////////
  .refine(
    (data) => {
      const isValid = data.password === data.confirmPassword
      return isValid
    },
    {
      message: 'The passwords must match.',
      path: ['confirmPassword']
    }
  )

export type FormValues = z.infer<typeof schema>
