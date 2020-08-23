import Extractor from './classes/Extractor'
import Processs from './classes/Process'

/**
 * Use process for initial, check update, session control and more
 */
export const process = new Processs()

/**
 * Initial extractor to handling template
 */
export const extractor = new Extractor()

/**
 * To identify boostrap has been called and initialized
 */
export const state = {
  initialized: false,
}
