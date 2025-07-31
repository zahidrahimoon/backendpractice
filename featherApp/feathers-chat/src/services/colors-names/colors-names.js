// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  colorsNamesDataValidator,
  colorsNamesPatchValidator,
  colorsNamesQueryValidator,  
  colorsNamesResolver,
  colorsNamesExternalResolver,
  colorsNamesDataResolver,
  colorsNamesPatchResolver,
  colorsNamesQueryResolver
} from './colors-names.schema.js'
import { ColorsNamesService, getOptions } from './colors-names.class.js'
import { colorsNamesPath, colorsNamesMethods } from './colors-names.shared.js'

export * from './colors-names.class.js'
export * from './colors-names.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const colorsNames = app => {
  // Register our service on the Feathers application
  app.use(colorsNamesPath, new ColorsNamesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: colorsNamesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(colorsNamesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(colorsNamesExternalResolver),
        schemaHooks.resolveResult(colorsNamesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(colorsNamesQueryValidator),
        schemaHooks.resolveQuery(colorsNamesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(colorsNamesDataValidator),
        schemaHooks.resolveData(colorsNamesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(colorsNamesPatchValidator),
        schemaHooks.resolveData(colorsNamesPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
