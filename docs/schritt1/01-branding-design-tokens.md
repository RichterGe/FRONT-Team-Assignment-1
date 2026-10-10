# Brand Overview

- **Team and platform name:** GameFoundry
- **Audience:** International game-development professionals across design, engineering, visual art, and production
- **Platform language:** English
- **Purpose:** Discover sessions and speakers, and build a personal conference programme
- **Visual direction:** Industrial and technical, with a dark signature aesthetic and a complementary light theme
- **Color concept:** Cyan and blue represent digital molten energy; orange adds secondary foundry heat
- **Primary CTA:** “Forge Your Schedule”


## Description

GameFoundry is an English-language conference platform for game-development professionals across design, engineering, art, and production. Unlike a generic conference website, it focuses on the practical exchange of game-development knowledge, helping attendees discover relevant sessions and build a personal schedule. Its industrial visual identity connects technical precision with creative experimentation, expressed through the primary call to action: **“Forge Your Schedule.”**

## Brand Colors

The visual concept interprets a foundry as a place where ideas become playable experiences. Deep blue and graphite tones represent steel and industrial workspaces, while bright cyan suggests a fictional flow of digital molten metal.

Dark mode is the defualt and uses deep blue surfaces, light text, and bright accents. Light mode uses pale neutral surfaces, dark text, and darker accents. Cyan remains the primary action color in both themes; orange supplements it as a contrasting color introducing warmth.

- **Dark backgrounds and layered surfaces:** --blue-950 #08131C and --blue-900 #10222E
- **Hero button and headline highlights:** --cyan-500 #18D7E8
- **Darker cyan alternative for the light theme:** --cyan-700 #007E91
- **Neutral text colors:** --gray-050 #F5F8FA and --gray-900 #17212B
- **Secondary emphasis and featured-session badges:** Orange tones ranging from --orange-300 #FFB36B to --orange-700 #9E470F


## Spacing and Typography

Spacing follows a four-pixel base, with steps of 4, 8, 16, 24, 32, 48, and 64 pixels. Smaller values support compact interface elements, while larger values separate cards and sections.

Typography uses a scale of 12, 14, 16, 20, 24, 32, and 48 pixels, implemented in relative rem units. Body text starts at 16 pixels, with smaller sizes reserved for labels and metadata. Larger sizes establish clear heading and hero hierarchies.

## Token Architecture and Rationale

The centrally maintained "tokens.css" file serves as the Single Source of Truth. Primitive tokens define raw colors, spacing, and typography values. Semantic tokens assign these values a purpose: for example, "--color-action-primary" references "--cyan-500" in the dark theme. Components consume semantic tokens. This separation follows the course’s 3-layer token model.

**Maintainability:** A shared design decision can be updated centrally instead of being changed separately in multiple components. This reduces duplication and makes corrections easier to review.

**Theme extensibility:** Light and dark themes retain identical semantic names while changing their primitive references. Component styles therefore remain unchanged when the active theme changes.

**Consistency:** Shared roles ensure that primary actions, surfaces, and text follow the same visual rules throughout the platform. Component-specific aliases may be introduced where necessary, but they must reference semantic tokens rather than bypassing them.

**Accessibility:** I tested the color pairs with the highest risk.
Dark Mode: Dark blue background to cyan colored text has a contrast ratio of 7.01:1
Light Mode: bright grey background to cyan colored text has a contrast ratio of 4.48:1


