// Fork addition (Conansgithub/orca): `orca://open?host=<fingerprint>&worktree=<id>&pane=<paneKey>&exec=<host>`
// opens a session the way a notification tap does. The ntfy push gateway puts it on notifications.
export type OpenLink = {
  hostFingerprint: string
  worktreeId: string
  paneKey?: string
  executionHost?: string
}

type Params = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined): string | undefined =>
  (Array.isArray(value) ? value[0] : value)?.trim() || undefined

export function readOpenLinkParams(params: Params): OpenLink | null {
  const hostFingerprint = first(params.host)
  const worktreeId = first(params.worktree)
  if (!hostFingerprint || !worktreeId) {
    return null
  }
  const paneKey = first(params.pane)
  const executionHost = first(params.exec)
  return {
    hostFingerprint,
    worktreeId,
    ...(paneKey ? { paneKey } : {}),
    ...(executionHost ? { executionHost } : {})
  }
}

// The root layout owns navigation; the /open screen hands the link over and gets out of the stack.
let listener: ((link: OpenLink) => void) | null = null
let pending: OpenLink | null = null

export function requestOpenLink(link: OpenLink): void {
  if (listener) {
    listener(link)
  } else {
    pending = link
  }
}

export function subscribeOpenLinks(next: (link: OpenLink) => void): () => void {
  listener = next
  if (pending) {
    const link = pending
    pending = null
    next(link)
  }
  return () => {
    if (listener === next) {
      listener = null
    }
  }
}
