import { z } from 'zod'

/* ======================
        schema
====================== */

export const schema = z.object({
  name: z.string().min(1, 'A name is required.'),
  description: z.string().min(1, 'A description is required.'),
  price: z
    .string()
    .min(1, 'A price is required.')

    .refine(
      (value) => {
        // Number('') type coerces to 0, so in order to prevent a false positive,
        // we can perform a quick check BEFORE using Number(value). This works
        // similar to  .min(1, 'A price is required.'), but min() does not catch
        // empty spaces.
        if (value.trim() === '') {
          return false
        }

        return !isNaN(Number(value))
      },
      {
        message: 'Invalid value (must be a number).'
        ///////////////////////////////////////////////////////////////////////////
        //
        // Gotcha:
        //
        //  path: ['price']
        //
        // React Hook Form expects the error path to match the field name directly, rather than
        // an array path. When you specify ['price'], React Hook Form is unable to correctly associate
        // the error with the "price" input field.
        //
        // The path property in Zod is used to specify the location of the error in the data structure.
        // When you’re validating a simple string like price, there’s no need to specify a path because
        // the error is occurring at the top level of the structure.
        //
        // In this case, when you specify path: ['price'], it’s telling React Hook Form that the error is nested
        // inside an object under the key ‘price’. But since ‘price’ is not an object, this causes confusion.
        //
        // If you were validating a nested object, then you would use the path property to specify the location
        // of the error. For example, if you had an object like { price: { value: '100' } }, and you wanted to
        // validate the ‘value’ property, you could use path: ['price', 'value']. But for a simple string like ‘price’, it’s not necessary.
        //
        // The reason why omitting the path option altogether works as intended is that React Hook Form
        // can then infer the field name from the schema itself, without needing the explicit path information.
        //
        ///////////////////////////////////////////////////////////////////////////
      }
    )
    .transform(Number) // Convert to number for subsequent validations

    .refine(
      (value) => {
        return value > 0
      },
      {
        message: 'The price must be larger than 0.'
      }
    )

    .refine(
      (value) => {
        // This will also screen out negative values, but if you wanted negative values
        // in some other case, then use this: /^-?\d+(\.\d{1,2})?$/
        return (
          Number.isInteger(value) || ('' + value).match(/^\d+(\.\d{1,2})?$/)
        )
      },
      {
        message:
          'Invalid value: price must not contain more than two decimal places.'
      }
    )

    .transform(String), // Convert back to string

  brand: z
    .string()
    .min(1, 'A brand is required.')
    .regex(
      new RegExp(/^[^\s]+(\s+[^\s]+)*$/),
      'The value must not begin or end with a space.'
    ),

  category: z
    .string()
    .min(1, 'A category is required.')
    .regex(
      new RegExp(/^[^\s]+(\s+[^\s]+)*$/),
      'The value must not begin or end with a space.'
    ),

  stock: z
    .string()
    .min(1, 'Stock is required.')

    .refine(
      (value) => {
        if (value.trim() === '') {
          return false
        }

        return !isNaN(Number(value))
      },
      {
        message: 'Invalid value (must be a number).'
      }
    )
    .transform(Number) // Convert to number for subsequent validations

    .refine(
      (value) => {
        return value >= 0
      },
      {
        message: 'Stock must not be negative.'
      }
    )

    .refine(
      (value) => {
        return Number.isInteger(value)
      },
      {
        message: 'Invalid value: stock must be an integer.'
      }
    )

    .transform(String) // Convert back to string
})

export type FormValues = z.infer<typeof schema>

export const defaultValues: FormValues = {
  name: '',
  description: '',
  price: '',
  brand: '',
  category: '',
  stock: ''
}
