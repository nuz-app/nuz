import findExportsProperty from './findExportsProperty'

function getExportsModule<T extends unknown>(context: any, named?: string): T {
  return context[findExportsProperty(context, named)]
}

export default getExportsModule
