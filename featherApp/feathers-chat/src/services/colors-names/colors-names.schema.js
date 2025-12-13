// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const colorsNamesSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    text: Type.String()
  },
  { $id: 'ColorsNames', additionalProperties: false }
)
export const colorsNamesValidator = getValidator(colorsNamesSchema, dataValidator)
export const colorsNamesResolver = resolve({})

export const colorsNamesExternalResolver = resolve({})

// Schema for creating new entries
export const colorsNamesDataSchema = Type.Pick(colorsNamesSchema, ['text'], {
  $id: 'ColorsNamesData'
})
export const colorsNamesDataValidator = getValidator(colorsNamesDataSchema, dataValidator)
export const colorsNamesDataResolver = resolve({})

// Schema for updating existing entries
export const colorsNamesPatchSchema = Type.Partial(colorsNamesSchema, {
  $id: 'ColorsNamesPatch'
})
export const colorsNamesPatchValidator = getValidator(colorsNamesPatchSchema, dataValidator)
export const colorsNamesPatchResolver = resolve({})

// Schema for allowed query properties
export const colorsNamesQueryProperties = Type.Pick(colorsNamesSchema, ['_id', 'text'])
export const colorsNamesQuerySchema = Type.Intersect(
  [
    querySyntax(colorsNamesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const colorsNamesQueryValidator = getValidator(colorsNamesQuerySchema, queryValidator)
export const colorsNamesQueryResolver = resolve({})
