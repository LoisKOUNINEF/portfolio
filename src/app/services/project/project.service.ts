import { I18nService, Service } from '../../../core/index.js';

export type ProjectConfigFolder = ProjectFolderName | Nutin.CatalogItemConfig<ProjectFolderName>;
// A project, with its catalog index when rendered from a catalog
export type ProjectConfigObject = IProject & Partial<Nutin.CatalogItemBase>;

// Projects shown in each tab of the Projects section, in display order
export const PROJECT_GROUPS: Record<'apps' | 'tools' | 'infra', ProjectFolderName[]> = {
  apps: ['paris-2024', 'notelet', 'retro-cabinet', 'narrative-palettes'],
  tools: ['nutin', 'a11y-elements'],
  infra: ['self-hosting', 'ci-cd', 'mailer'],
};

// Every project folder, for validating a value read from the URL
export const isProjectFolder = (value: string): value is ProjectFolderName =>
  Object.values(PROJECT_GROUPS).some((folders) => (folders as string[]).includes(value));

export class Project extends Service<Project> {
  public getProject(folderName: ProjectConfigFolder): ProjectConfigObject {
    return this.handleIndex(folderName);
  }

  public parseFolderName(folderName: ProjectConfigFolder): ProjectFolderName {
    let parsedFolderName;

    if(typeof folderName !== 'string' && folderName.value) 
      parsedFolderName = folderName.value;
    else parsedFolderName = folderName;

    return parsedFolderName as ProjectFolderName;
  }

  private handleIndex(folderName: ProjectConfigFolder): ProjectConfigObject {
    const folder = this.parseFolderName(folderName);
    let project;
    if (
      typeof folderName !== 'string' 
      && 'index' in folderName
    ) {
      project = { 
        ...this.getTranslated(folder),
        index: folderName.index
      };
    } else {
       project = this.getTranslated(folder);
    }
    return project;
  }

  private getTranslated(projectFolderName: ProjectFolderName): IProject {
    const translated = I18nService.getTranslationObject<IProject>(`${projectFolderName}`);
    
    if (!translated) {
      throw new Error(`Project ${projectFolderName} not found`);
    }  
    return translated;
  }
}

export const ProjectService = Project.getInstance();
