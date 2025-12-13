import { colorsNames } from './colors-names/colors-names.js'
import { user } from './users/users.js'

export const services = app => {
  app.configure(colorsNames)

  app.configure(user)

  // All services will be registered here
}
