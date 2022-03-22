// Provides dev-time type structures for `danger` - doesn't affect runtime,
// and are not exported out.
//
import {DangerDSLType} from "../node_modules/danger/distribution/dsl/DangerDSL"
import {DangerResults} from "../node_modules/danger/distribution/dsl/DangerResults"

declare var danger: DangerDSLType
/**
 * Current results of Danger run instance
 */
declare var results: DangerResults
declare function message(message: string): void
declare function warn(message: string): void
declare function fail(message: string): void
declare function markdown(message: string): void

/**
 * <%= description %>
 */
export default function <%= pluginFunctionName %>() {
  // Replace this with the code from your Dangerfile
  const title = danger.github.pr.title
  message(`PR Title: ${title}`)
}
