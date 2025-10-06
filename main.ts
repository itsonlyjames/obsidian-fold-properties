import { MarkdownView, Menu, Notice, Plugin, TFile, TFolder } from 'obsidian'

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
                            item.setTitle('Fold properties')
                                .setIcon('fold')
                                .onClick(async () => {
                                    await this.foldAllProperties(file)
                                    new Notice(
                                        `Folded properties for all files in ${file.path}`
                                    )
                                })
                        })

                        menu.addItem((item) => {
                            item.setTitle('Unfold properties')
                                .setIcon('unfold')
                                .onClick(async () => {
                                    await this.unfoldAllProperties(file)
                                    new Notice(
                                        `Unfolded properties for all files in ${file.path}`
                                    )
                                })
                        })
                    } else if (file instanceof TFile) {
                        menu.addItem((item) => {
                            item.setTitle('Fold properties')
                                .setIcon('fold')
                                .onClick(async () => {
                                    await this.foldPropertiesForFile(file)
                                    new Notice(
                                        `Folded properties in ${file.path}`
                                    )
                                })
                        })

                        menu.addItem((item) => {
                            item.setTitle('Unfold properties')
                                .setIcon('unfold')
                                .onClick(async () => {
                                    await this.unfoldPropertiesForFile(file)
                                    new Notice(
                                        `Unfolded properties in ${file.path}`
                                    )
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
    }

    async unfoldAllProperties(folder: TFolder) {
        for (const child of folder.children) {
            if (child instanceof TFile) {
                await this.unfoldPropertiesForFile(child)
            } else if (child instanceof TFolder) {
                await this.unfoldAllProperties(child)
            }
        }
    }

    async foldPropertiesForFile(file: TFile) {
        const app = this.app as any
        const existingFolds: FoldedProperties | null = app.foldManager.loadPath(
            file.path
        )

        if (existingFolds && this.isPropertiesFolded(existingFolds)) {
            return
        }

        if (!existingFolds) {
            const content = await app.vault.read(file)
            const lines = content.split('\n')
            const folds = {
                folds: [{ from: 0, to: 0 }],
                lines: lines.length
            }
            app.foldManager.savePath(file.path, folds)
        } else {
            const foldedProperties = {
                folds: [{ from: 0, to: 0 }, ...existingFolds.folds],
                lines: existingFolds.lines
            }
            app.foldManager.savePath(file.path, foldedProperties)
        }

        // Find and switch to target leaf
        // Necessary to run fold properties toggle on active open file
        const leaves = app.workspace.getLeavesOfType('markdown')
        const targetLeaf = leaves.find(
            (leaf: { view: MarkdownView }) =>
                (leaf.view as MarkdownView).file?.path === file.path
        )

        if (targetLeaf) {
            const originalLeaf = app.workspace.activeLeaf
            app.workspace.setActiveLeaf(targetLeaf, { focus: true })
            await new Promise((resolve) => setTimeout(resolve, 50))
            await app.commands.executeCommandById(
                'editor:toggle-fold-properties'
            )
            if (originalLeaf && originalLeaf !== targetLeaf) {
                app.workspace.setActiveLeaf(originalLeaf, { focus: true })
            }
        }
    }

    async unfoldPropertiesForFile(file: TFile) {
        const app = this.app as any
        const existingFolds = (this.app as any).foldManager.loadPath(file.path)

        if (!existingFolds || !this.isPropertiesFolded(existingFolds)) {
            return
        }

        // Remove properties fold from state
        if (
            existingFolds.folds.every((el: Fold) => el.from == 0) &&
            existingFolds.folds.some((el: Fold) => el.to == 0)
        ) {
            // Only properties folded, remove entirely
            const path = app.appId + '-note-fold-' + file.path
            localStorage.removeItem(path)
        } else {
            // Other folds exist, just remove properties
            const unfoldedProperties = {
                folds: existingFolds.folds.filter((el: Fold) => el.from !== 0),
                lines: existingFolds.lines
            }
            app.foldManager.savePath(file.path, unfoldedProperties)
        }

        // Find and switch to target leaf
        // Necessary to run fold properties toggle on active open file
        const leaves = app.workspace.getLeavesOfType('markdown')
        const targetLeaf = leaves.find(
            (leaf: { view: MarkdownView }) =>
                (leaf.view as MarkdownView).file?.path === file.path
        )

        if (targetLeaf) {
            const originalLeaf = app.workspace.activeLeaf
            app.workspace.setActiveLeaf(targetLeaf, { focus: true })
            await new Promise((resolve) => setTimeout(resolve, 50))
            await app.commands.executeCommandById(
                'editor:toggle-fold-properties'
            )
            if (originalLeaf && originalLeaf !== targetLeaf) {
                app.workspace.setActiveLeaf(originalLeaf, { focus: true })
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
