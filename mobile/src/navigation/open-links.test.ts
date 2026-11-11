import { describe, expect, it } from 'vitest'
import { readOpenLinkParams, requestOpenLink, subscribeOpenLinks, type OpenLink } from './open-links'

describe('open links', () => {
  it('reads host and worktree, keeps optional pane and execution host', () => {
    expect(readOpenLinkParams({ host: 'qYM-rkrOGxdIu125', worktree: 'repo::/w a', pane: 'tab:1' })).toEqual({
      hostFingerprint: 'qYM-rkrOGxdIu125',
      worktreeId: 'repo::/w a',
      paneKey: 'tab:1'
    })
    expect(readOpenLinkParams({ host: ['fp'], worktree: ['w'], exec: 'runtime:x' })).toEqual({
      hostFingerprint: 'fp',
      worktreeId: 'w',
      executionHost: 'runtime:x'
    })
    expect(readOpenLinkParams({ host: 'fp' })).toBeNull()
    expect(readOpenLinkParams({ worktree: 'w', host: ' ' })).toBeNull()
  })

  it('delivers a link requested before the root layout subscribed, then live ones', () => {
    const seen: OpenLink[] = []
    requestOpenLink({ hostFingerprint: 'a', worktreeId: '1' })
    const unsubscribe = subscribeOpenLinks((link) => seen.push(link))
    requestOpenLink({ hostFingerprint: 'b', worktreeId: '2' })
    unsubscribe()
    requestOpenLink({ hostFingerprint: 'c', worktreeId: '3' })
    expect(seen.map((link) => link.hostFingerprint)).toEqual(['a', 'b'])
  })
})
