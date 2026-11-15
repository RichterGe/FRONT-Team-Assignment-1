import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Hintergrund = --blue-950 / --color-bg aus tokens.css
const background = '#08131C'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    // favicon.ico bleibt im Root von public/, dort fragen Browser danach
    transparent: { ...minimal2023Preset.transparent, favicons: [] },
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background } },
  },
  images: ['public/icons/logo.svg'], // Ausgabe landet im selben Ordner
})
