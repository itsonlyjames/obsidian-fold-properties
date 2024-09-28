import { Menu, Notice, Plugin, TFile, TFolder } from 'obsidian'

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
        const content = await app.vault.read(file)
        const lines = content.split('\n')

        const folds = {
            folds: [{ from: 0, to: 0 }],
            lines: lines.length
        }

        app.foldManager.savePath(file.path, folds)
    }

    async unfoldPropertiesForFile(file: TFile) {
        const existingFolds = (this.app as any).foldManager.loadPath(file.path)

        if (existingFolds) {
            const path = (this.app as any).appId + '-note-fold-' + file.path
            localStorage.removeItem(path)
        }
    }

    onunload() {}
}
