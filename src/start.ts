import { createStart } from '@tanstack/react-start'
import { loggingMiddleware } from './middleware/logging-middleware'

export default createStart(() => ({
    requestMiddleware: [loggingMiddleware],
}))
