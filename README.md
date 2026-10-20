# Obsidian Fold Properties

Fold or unfold the properties of one note, a whole folder, or your entire vault in a single click.

![Fold Properties: right-click a folder, choose Fold properties, and every note folds](docs/hero.gif)

[Watch in full quality (MP4)](docs/hero.mp4)

## Why

Long property blocks push your actual writing down the page. Obsidian lets you fold properties one note at a time. Fold Properties does it in bulk, and the fold is saved for every note, including the ones you haven't opened yet.

## Usage

### From the file explorer

| Right-click on | Choose                                      | Result                                                        |
| -------------- | ------------------------------------------- | ------------------------------------------------------------- |
| A note         | **Fold properties** / **Unfold properties** | Folds or unfolds that note's properties                       |
| A folder       | **Fold properties** / **Unfold properties** | Applies to every note in the folder, including its subfolders |

### From the command palette

| Command                            | What it does                                       |
| ---------------------------------- | -------------------------------------------------- |
| **Fold properties in all notes**   | Folds the properties of every note in your vault   |
| **Unfold properties in all notes** | Unfolds the properties of every note in your vault |

Notes that are already open update straight away, and a notice confirms each action.

## Installation

### From Community Plugins

1. Open **Settings → Community plugins**.
2. Turn off **Restricted mode** if prompted.
3. Click **Browse** and search for "Fold Properties".
4. Click **Install**, then **Enable**.

### Manual installation

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/itsonlyjames/obsidian-fold-properties/releases/latest).
2. Copy them into `<your vault>/.obsidian/plugins/fold-properties/`.
3. Reload Obsidian and enable **Fold Properties** under **Settings → Community plugins**.

## Compatibility

Works on desktop and mobile. Requires Obsidian 0.16.3 or later.

## Related plugins

- [Sync Folds](https://github.com/itsonlyjames/obsidian-sync-folds) keeps your fold states, folded properties included, in sync across devices.
- [Quick Select](https://github.com/itsonlyjames/obsidian-quick-select) lets you run commands like **Fold properties in all notes** with <kbd>Mod</kbd> + number.

## Support

If this plugin saves you some scrolling, consider [sponsoring its development](https://github.com/sponsors/itsonlyjames).

## License

[MIT](LICENSE.txt)
