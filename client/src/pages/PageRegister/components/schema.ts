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
    password: z.string().min(5, 'Must be at least 5 characters.'),
    // .nonempty('Required.') is still important to prevent false
    // positives when both password and confirm password are empty.
    // However, it's now deprecated, so do this instead.
    confirmPassword: z.string().min(1, 'Required.')
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

export const defaultValues: FormValues = {
  userName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
}
