export const colorsNamesPath = 'colors-names'

export const colorsNamesMethods = ['find', 'get', 'create', 'patch', 'remove']

export const colorsNamesClient = client => {
  const connection = client.get('connection')

  client.use(colorsNamesPath, connection.service(colorsNamesPath), {
    methods: colorsNamesMethods
  })
}
