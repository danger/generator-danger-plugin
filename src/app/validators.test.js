import { description } from './validators'

describe('description()', () => {
  it('returns true when non-empty input is passed in', () => {
    expect(description('Any description')).toBe(true)
  })
  it('returns error message when input is empty', () => {
    expect(description('')).toEqual('Please provide a description')
  })
})
