import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { colors } from '../src/theme/mobile-theme'
import { readOpenLinkParams, requestOpenLink } from '../src/navigation/open-links'

// Fork addition: target of orca://open links; see src/navigation/open-links.ts.
export default function OpenLinkScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()

  useEffect(() => {
    const link = readOpenLinkParams(params)
    // Leave first so Back from the session never lands on this placeholder.
    router.replace('/')
    if (link) {
      requestOpenLink(link)
    }
    // Run once per link: the screen is replaced right away.
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgBase }}>
      <ActivityIndicator size="large" color={colors.textSecondary} />
    </View>
  )
}
