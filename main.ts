import { Menu, Notice, Plugin, TFile, TFolder } from 'obsidian'

interface Fold {
    from: number
    to: number
}

interface FoldedProperties {
    folds: Fold[]
    lines: number
}

export default class FoldProperties extends Plugin {
    async onload() {
        this.registerEvent(
            this.app.workspace.on(
                'file-menu',
                (menu: Menu, file: TFile | TFolder) => {
                    if (file instanceof TFolder && file.children.length !== 0) {
                        menu.addItem((item) => {
                            item.setTitle('Fold Properties')
                                .setIcon('fold')
                                .onClick(async () => {
                                    await this.foldAllProperties(file)
                                })
                        })

                        menu.addItem((item) => {
                            item.setTitle('Unfold Properties')
                                .setIcon('unfold')
                                .onClick(async () => {
                                    await this.unfoldAllProperties(file)
                                })
                        })
                    } else if (file instanceof TFile) {
                        menu.addItem((item) => {
                            item.setTitle('Fold Properties')
                                .setIcon('fold')
                                .onClick(async () => {
                                    await this.foldPropertiesForFile(file)
                                })
                        })

                        menu.addItem((item) => {
                            item.setTitle('Unfold Properties')
                                .setIcon('unfold')
                                .onClick(async () => {
                                    await this.unfoldPropertiesForFile(file)
                                })
                        })
                    }
                }
            )
        )
    }

    async foldAllProperties(folder: TFolder) {
        for (const child of folder.children) {
            if (child instanceof TFile) {
                await this.foldPropertiesForFile(child)
            } else if (child instanceof TFolder) {
                await this.foldAllProperties(child)
            }
        }
        new Notice(`Folded properties for all files in ${folder.path}`)
    }

    async unfoldAllProperties(folder: TFolder) {
        for (const child of folder.children) {
            if (child instanceof TFile) {
                await this.unfoldPropertiesForFile(child)
            } else if (child instanceof TFolder) {
                await this.unfoldAllProperties(child)
            }
        }
        new Notice(`Unfolded properties for all files in ${folder.path}`)
    }

    async foldPropertiesForFile(file: TFile) {
        const app = this.app as any
        const existingFolds: FoldedProperties | null = app.foldManager.loadPath(
            file.path
        )

        if (!existingFolds) {
            // Create new fold object
            const content = await app.vault.read(file)
            const lines = content.split('\n')
            const folds = {
                folds: [{ from: 0, to: 0 }],
                lines: lines.length
            }
            app.foldManager.savePath(file.path, folds)
        }

        if (existingFolds && !this.isPropertiesFolded(existingFolds)) {
            // Add folded properties to existing fold object
            const foldedProperties = {
                folds: [{ from: 0, to: 0 }, ...existingFolds.folds],
                lines: existingFolds.lines
            }
            app.foldManager.savePath(file.path, foldedProperties)
        }
    }

    async unfoldPropertiesForFile(file: TFile) {
        const app = this.app as any
        const existingFolds = (this.app as any).foldManager.loadPath(file.path)

        // rather than removing entirely the item remove only the folds from 0
        // can write a function to handle this for both fold/unfold
        // if the properties are the only ones then we can delete

        if (existingFolds && this.isPropertiesFolded(existingFolds)) {
            /**
             * Check if all elements in the array have `from` set to 0,
             * and if at least one element has `to` set to 0.
             *
             * This is necessary because Obsidian represents folded properties
             * using the object structure { from: 0, to: 0 }. However, Obsidian
             * may also correctly assign other values for the `to` property,
             * such as { from: 0, to: 7 }.
             */
            if (
                existingFolds.folds.every((el: Fold) => el.from == 0) &&
                existingFolds.folds.some((el: Fold) => el.to == 0)
            ) {
                // Only folded properties exist, remove local storage item
                const path = app.appId + '-note-fold-' + file.path
                localStorage.removeItem(path)
            } else {
                // contains other folds, strip only the properties
                const unfoldedProperties = {
                    folds: existingFolds.folds.filter(
                        (el: Fold) => el.from !== 0
                    ),
                    lines: existingFolds.lines
                }
                app.foldManager.savePath(file.path, unfoldedProperties)
            }
        }
    }

    isPropertiesFolded(existingFolds: FoldedProperties) {
        return existingFolds.folds.some(
            (item) => item.from == 0 && item.to == 0
        )
    }

    onunload() {}
}
