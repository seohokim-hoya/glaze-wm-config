# GlazeWM + Zebar Config

A clean Windows desktop setup built around [GlazeWM](https://github.com/glzr-io/glazewm) and [Zebar](https://github.com/glzr-io/zebar).

This repository keeps the window manager rules and the top bar widget in one place, so the layout, spacing, and status bar stay in sync.

## Upstream

- GlazeWM: https://github.com/glzr-io/glazewm
- GlazeWM releases: https://github.com/glzr-io/glazewm/releases
- Zebar: https://github.com/glzr-io/zebar
- Zebar releases: https://github.com/glzr-io/zebar/releases

## Repository Layout

- [`glazewm/config.yaml`](/mnt/c/Users/seoho/.glzr/glazewm/config.yaml): main GlazeWM configuration
- [`zebar/settings.json`](/mnt/c/Users/seoho/.glzr/zebar/settings.json): global Zebar settings
- [`zebar/header/zpack.json`](/mnt/c/Users/seoho/.glzr/zebar/header/zpack.json): widget pack definition for the top bar
- [`zebar/header/index.html`](/mnt/c/Users/seoho/.glzr/zebar/header/index.html): widget entry page
- [`zebar/header/app.js`](/mnt/c/Users/seoho/.glzr/zebar/header/app.js): bar logic and data rendering
- [`zebar/header/styles.css`](/mnt/c/Users/seoho/.glzr/zebar/header/styles.css): bar styling

## GlazeWM

[`glazewm/config.yaml`](/mnt/c/Users/seoho/.glzr/glazewm/config.yaml) is the core of the setup.

It currently:

- starts `zebar` when GlazeWM launches
- kills `zebar.exe` when GlazeWM exits
- defines 9 workspaces
- reserves a `44px` top gap for the bar
- applies different border colors for focused and unfocused windows
- uses `Alt`-based keybindings for focus, move, resize, floating, fullscreen, and workspace control
- ignores Zebar widget windows so they never get tiled
- opens the Zebar settings window as a centered floating window
- keeps KakaoTalk floating and ignores browser picture-in-picture windows

## Zebar

This repo includes a custom top bar widget under [`zebar/header`](/mnt/c/Users/seoho/.glzr/zebar/header).

The widget is defined in [`zebar/header/zpack.json`](/mnt/c/Users/seoho/.glzr/zebar/header/zpack.json) and rendered by [`app.js`](/mnt/c/Users/seoho/.glzr/zebar/header/app.js).

The bar shows:

- GlazeWM workspaces
- the focused window title
- date and time
- network status
- CPU and memory usage
- audio volume
- battery status
- a live BTC price from Binance

The visual style uses a translucent glass-like background, compact pill sections, and clear accent colors for focus and alerts.

## Installation

1. Install GlazeWM from the official repository or release page.
2. Install Zebar from the official repository or release page.
3. Place this repository at `%USERPROFILE%\.glzr`.
4. Make sure the files end up at these default paths:
   - `%USERPROFILE%\.glzr\glazewm\config.yaml`
   - `%USERPROFILE%\.glzr\zebar\settings.json`
   - `%USERPROFILE%\.glzr\zebar\header\zpack.json`
5. Start GlazeWM.
6. Open the Zebar tray app and enable the `header / top-bar` widget.
7. In Zebar, optionally enable `Run on startup` for that widget.

## Apply Changes

### GlazeWM changes

After editing [`glazewm/config.yaml`](/mnt/c/Users/seoho/.glzr/glazewm/config.yaml), reload GlazeWM with `Alt+Shift+R`.

### Zebar changes

After editing files under [`zebar/header`](/mnt/c/Users/seoho/.glzr/zebar/header), reopen the widget or restart Zebar from the tray if the changes do not appear immediately.

## Notes

- GlazeWM launches the Zebar application through `startup_commands`.
- [`zebar/settings.json`](/mnt/c/Users/seoho/.glzr/zebar/settings.json) currently has no startup widgets configured, so the widget itself should be enabled once in the Zebar UI.
- The `44px` top outer gap in GlazeWM is sized to leave room for the `40px` top bar.
